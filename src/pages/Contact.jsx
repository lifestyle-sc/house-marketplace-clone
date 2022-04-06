import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  getDoc,
  doc,
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({
    email: '',
    message: '',
  });

  const { email, message } = formData;
  const [landlord, setLandlord] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  // const navigate = useNavigate()

  const params = useParams();

  useEffect(() => {
    const getLandlord = async () => {
      const docRef = doc(db, 'users', params.landlordId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setLandlord(docSnap.data());
      } else {
        toast.error('Could not get landlord data');
      }
    };

    getLandlord();
  }, [params.landlordId]);

  const onChange = (e) => {
    setFormData((formData) => ({
      ...formData,
      [e.target.id]: e.target.value,
    }));
  };

  const onClick = async () => {
    const formDataCopy = {
      ...formData,
      landlordEmail: landlord.email,
      property: searchParams.get('listingName'),
      timestamp: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, 'offers'), formDataCopy);

    toast.success('message sent');

    console.log(docRef.id);
  };
  return (
    <div className="p-5">
      <header className="my-2">
        <p className="text-2xl font-black">Contact Landlord</p>
      </header>

      {landlord !== null && (
        <main className="my-2">
          <div className="py-2">
            <p className="font-bold">Contact {landlord?.name}</p>
          </div>

          <form className="messageForm">
            <div className="my-4">
              <span className="font-extrabold mb-3">Email</span>
              <div>
                <input
                  type="email"
                  className="rounded-xl py-2 px-5 w-full sm:max-w-xl font-bold focus:outline-none hover:shadow-md"
                  name="email"
                  id="email"
                  value={email}
                  onChange={onChange}
                />
              </div>
            </div>
            <div className="my-4">
              <span className="font-extrabold mb-3">Message</span>
              <div>
                <textarea
                  className="rounded-xl py-2 px-5 w-full h-44 sm:max-w-xl font-bold focus:outline-none hover:shadow-md"
                  name="message"
                  id="message"
                  value={message}
                  onChange={onChange}
                />
              </div>
            </div>

            <a
              href={`mailto:${landlord.email}?Subject=${searchParams.get(
                'listingName'
              )}&body=${message}`}
              onClick={onClick}
            >
              <div className="flex my-4">
                <button
                  type="button"
                  className="bg-green-500 text-white rounded-xl py-2 px-5 w-full sm:max-w-xl font-bold focus:outline-none hover:shadow-md"
                >
                  Send
                </button>
              </div>
            </a>
          </form>
        </main>
      )}
    </div>
  );
};

export default Contact;
