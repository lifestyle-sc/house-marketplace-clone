import { useState, useEffect, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import { v4 as uuidv4 } from 'uuid';
import Spinner from '../components/Spinner';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreateListing = () => {
  const [geolocationEnabled, setGeolocationEnabled] = useState(true);
  const [formData, setFormData] = useState({
    type: 'rent',
    name: '',
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: '',
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0,
  });

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    offer,
    regularPrice,
    discountedPrice,
    images,
    latitude,
    longitude,
  } = formData;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isMounted = useRef(true);
  const auth = getAuth();

  useEffect(() => {
    if (isMounted.current) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid });
        } else {
          navigate('/sign-in');
        }
      });
    }

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  const onMutate = (e) => {
    let boolean = null;
    if (e.target.value === 'true') {
      boolean = true;
    }
    if (e.target.value === 'false') {
      boolean = false;
    }

    // Files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }

    // Text/Booleans/Numbers
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (discountedPrice >= regularPrice) {
      setLoading(false);
      toast.error('Discounted price must be less than regular price');
      return;
    }

    if (images.length > 6) {
      setLoading(false);
      toast.error('Max images of 6');
      return;
    }

    let geolocation = {};
    let location;

    if (geolocationEnabled) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
      );

      const data = await response.json();
      geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
      geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;

      location =
        data.status === 'ZERO_RESULTS'
          ? undefined
          : data.results[0]?.formatted_address;

      if (location === undefined || location.includes('undefined')) {
        setLoading(false);
        toast.error('Please enter a correct address');
        return;
      }
    } else {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
    }

    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, `images/${fileName}`);

        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
              default:
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    const imageUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch(() => {
      setLoading(false);
      toast.error('Images not uploaded');
      return;
    });

    const formDataCopy = {
      ...formData,
      imageUrls,
      geolocation,
      timestamp: serverTimestamp(),
    };

    formDataCopy.location = address;
    delete formDataCopy.address;
    delete formDataCopy.images;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;

    const docRef = await addDoc(collection(db, 'listings'), formDataCopy);

    setLoading(false);
    toast.success('Listings Created');
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  };

  if (loading) return <Spinner />;

  return (
    <div className="p-5 mb-14">
      <header className="mb-3">
        <h1 className="text-2xl font-black">Create a listing</h1>
      </header>

      <main className="md:pl-5">
        <form onSubmit={onSubmit}>
          <div className="py-2">
            <span className="font-extrabold mb-3">Sell / Rent</span>
            <div className="flex gap-2">
              <button
                type="button"
                value="sale"
                id="type"
                onClick={onMutate}
                className={`rounded-2xl py-3 px-9 font-extrabold ${
                  type === 'sale'
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-black shadow-sm'
                }`}
              >
                Sell
              </button>
              <button
                type="button"
                value="rent"
                id="type"
                onClick={onMutate}
                className={`rounded-2xl py-3 px-9 font-extrabold ${
                  type === 'rent'
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-black shadow-sm'
                }`}
              >
                Rent
              </button>
            </div>
          </div>

          <div className="py-2">
            <span className="font-extrabold mb-3">Name</span>
            <div className="">
              <input
                type="text"
                id="name"
                value={name}
                onChange={onMutate}
                className="rounded-xl py-2 px-5 w-full sm:max-w-xl font-bold focus:outline-none hover:shadow-md"
                maxLength="32"
                minLength="10"
                required
              />
            </div>
          </div>

          <div className="flex gap-5 items-center my-4">
            <div className="flex flex-col">
              <span className="font-extrabold mb-1">Bedrooms</span>
              <input
                className="focus:outline-none w-14 rounded-lg font-bold py-2 pl-2"
                type="number"
                id="bedrooms"
                value={bedrooms}
                onChange={onMutate}
                min="1"
                max="50"
                required
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold mb-1">Bathrooms</span>
              <input
                className="focus:outline-none w-14 rounded-lg font-bold py-2 pl-2"
                type="number"
                id="bathrooms"
                value={bathrooms}
                onChange={onMutate}
                min="1"
                max="50"
                required
              />
            </div>
          </div>

          <div className="my-4">
            <span className="font-extrabold mb-3">Parking spot</span>
            <div className="flex gap-3">
              <button
                className={`rounded-2xl py-3 px-9 font-extrabold ${
                  parking
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-black shadow-sm'
                }`}
                type="button"
                id="parking"
                value={true}
                onClick={onMutate}
                min="1"
                max="50"
              >
                Yes
              </button>
              <button
                className={`rounded-2xl py-3 px-9 font-extrabold ${
                  !parking
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-black shadow-sm'
                }`}
                type="button"
                id="parking"
                value={false}
                onClick={onMutate}
                min="1"
                max="50"
              >
                No
              </button>
            </div>
          </div>

          <div className="my-4">
            <span className="font-extrabold mb-3">Furnished</span>
            <div className="flex gap-3">
              <button
                className={`rounded-2xl py-3 px-9 font-extrabold ${
                  furnished
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-black shadow-sm'
                }`}
                type="button"
                id="furnished"
                value={true}
                onClick={onMutate}
                min="1"
                max="50"
              >
                Yes
              </button>
              <button
                className={`rounded-2xl py-3 px-9 font-extrabold ${
                  !furnished
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-black shadow-sm'
                }`}
                type="button"
                id="furnished"
                value={false}
                onClick={onMutate}
                min="1"
                max="50"
              >
                No
              </button>
            </div>
          </div>

          <div className="my-4">
            <span className="font-extrabold mb-3">Address</span>
            <div>
              <textarea
                className="rounded-xl py-2 px-5 w-full sm:max-w-xl font-bold focus:outline-none hover:shadow-md"
                type="text"
                id="address"
                value={address}
                onChange={onMutate}
                required
              />
            </div>
          </div>

          {!geolocationEnabled && (
            <div className="flex gap-5 my-4">
              <div className="flex flex-col">
                <span className="font-extrabold mb-1">Latitude</span>
                <input
                  className="focus:outline-none w-14 rounded-lg font-bold py-2 pl-2"
                  type="number"
                  id="latitude"
                  value={latitude}
                  onChange={onMutate}
                  required
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold mb-1">Longitude</span>
                <input
                  className="focus:outline-none w-14 rounded-lg font-bold py-2 pl-2"
                  type="number"
                  id="longitude"
                  value={longitude}
                  onChange={onMutate}
                  required
                />
              </div>
            </div>
          )}

          <div className="my-4">
            <span className="font-extrabold mb-3">Offer</span>
            <div className="flex gap-2">
              <button
                className={`rounded-2xl py-3 px-9 font-extrabold ${
                  offer
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-black shadow-sm'
                }`}
                type="button"
                id="offer"
                value={true}
                onClick={onMutate}
              >
                Yes
              </button>
              <button
                className={`rounded-2xl py-3 px-9 font-extrabold ${
                  !offer && offer !== null
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-black shadow-sm'
                }`}
                type="button"
                id="offer"
                value={false}
                onClick={onMutate}
              >
                No
              </button>
            </div>
          </div>

          <div className="my-4">
            <span className="font-extrabold mb-3">Regular Price</span>
            <div className="flex items-center gap-3">
              <input
                className="focus:outline-none w-64 rounded-lg font-bold py-2 pl-2"
                type="number"
                id="regularPrice"
                value={regularPrice}
                onChange={onMutate}
                min="50"
                max="750000000"
                required
              />
              {type === 'rent' && <p className="font-bold">$ / Month</p>}
            </div>
          </div>

          {offer && (
            <div className="my-4">
              <span className="font-extrabold mb-3">Discounted Price</span>
              <div className="flex gap-3 items-center">
                <input
                  className="focus:outline-none w-64 rounded-lg font-bold py-2 pl-2"
                  type="number"
                  id="discountedPrice"
                  value={discountedPrice}
                  onChange={onMutate}
                  min="50"
                  max="750000000"
                  required={offer}
                />
                {type === 'rent' && <p className="font-bold">$ / Month</p>}
              </div>
            </div>
          )}

          <div className="my-4">
            <span className="font-extrabold mb-3">Images</span>
            <p className="text-gray-500 text-xs my-2">
              The first image will be the cover (max 6).
            </p>
            <input
              className="block w-full text-sm text-slate-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-green-50 file:text-green-500
            hover:file:bg-green-100"
              type="file"
              id="images"
              onChange={onMutate}
              max="6"
              accept=".jpg,.png,.jpeg"
              multiple
              required
            />
          </div>

          <div className="flex my-4">
            <button
              type="submit"
              className="bg-green-500 text-white rounded-xl py-2 px-5 w-full sm:max-w-xl font-bold focus:outline-none hover:shadow-md"
            >
              Create Listing
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateListing;
