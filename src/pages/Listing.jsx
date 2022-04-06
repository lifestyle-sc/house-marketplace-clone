import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase.config';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { ShareIcon } from '@heroicons/react/solid';
import Spinner from '../components/Spinner';
//SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

const Listing = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  const auth = getAuth();
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, 'listings', params.listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    };

    fetchListing();
  }, [navigate, params.listingId]);

  if (loading) return <Spinner />;
  return (
    <main className="p-5 mb-16">
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
      >
        {listing?.imageUrls?.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              style={{
                background: `url(${url}) center no-repeat`,
                backgroundSize: 'cover',
              }}
              className='my-2 w-full h-48 md:h-60'
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        className="absolute top-8 right-6 p-3 rounded-full  bg-white shadow-lg hover:shadow-none cursor-pointer z-20"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <ShareIcon className="w-5" />
      </div>

      {shareLinkCopied && (
        <p className="absolute top-20 right-6 bg-white px-2 py-1 text-xs rounded-lg font-bold shadow-md z-20">
          Link Copied!
        </p>
      )}
      <div className="pt-3">
        <p className="text-xl font-extrabold">
          {listing.name} - $
          {listing.offer
            ? listing.discountedPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            : listing.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </p>
        <p className="font-bold">{listing.location}</p>
        <div className="flex gap-2 py-2 items-center">
          <p className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-lg">
            For {listing.type === 'rent' ? 'Rent' : 'Sale'}
          </p>
          {listing.offer && (
            <p className="px-2 py-1 bg-black text-white text-xs font-bold rounded-lg">
              ${listing.regularPrice - listing.discountedPrice} discount
            </p>
          )}
        </div>

        <ul className="py-2">
          <li>
            {listing.bedrooms > 1
              ? `${listing.bedrooms} Bedrooms`
              : '1 Bedroom'}
          </li>
          <li>
            {listing.bathrooms > 1
              ? `${listing.bathrooms} Bathrooms`
              : '1 Bathroom'}
          </li>
          <li>{listing.parking && 'Parking Spot'}</li>
          <li>{listing.furnished && 'Furnished'}</li>
        </ul>

        <p className="py-3 text-xl font-extrabold">Location</p>
        <div className="my-2 w-full h-48 md:h-56">
          <MapContainer
            style={{ height: '100%', width: '100%' }}
            center={[listing.geolocation.lat, listing.geolocation.lng]}
            zoom={13}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker
              position={[listing.geolocation.lat, listing.geolocation.lng]}
            >
              <Popup>{listing.location}</Popup>
            </Marker>
          </MapContainer>
        </div>

        {auth.currentUser?.uid !== listing.userRef && (
          <div className="flex my-4">
            <Link
              to={`/contact/${listing.userRef}?listingName=${listing.name}`}
              className="mt-4 bg-green-500 text-white text-center rounded-xl py-2 px-5 w-full sm:max-w-xl font-bold focus:outline-none hover:shadow-md"
            >
              Contact Landlord
            </Link>
          </div>
        )}
      </div>
    </main>
  );
};

export default Listing;
