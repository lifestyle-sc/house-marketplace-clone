import { useState } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { AnnotationIcon, ChatAlt2Icon, ChevronRightIcon, ClipboardIcon, HomeIcon } from '@heroicons/react/solid';

const Profile = () => {
  const auth = getAuth();
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData

  const navigate = useNavigate();

  const onLogout = (e) => {
    e.preventDefault();

    auth.signOut();

    navigate('/');
  };

  const onSubmit = async () => {
    try {
      if(auth.currentUser.displayName !== name){
        // update the name in firebase auth
        await updateProfile(auth.currentUser, {
          displayName: name,
        })
      }

       // update name in firestore
       const userRef = doc(db, 'users', auth.currentUser.uid)

       await updateDoc(userRef, {
         name
       }) 
      
    } catch (error) {
      toast.error("Can't complete the action, try again later")
    }
  }
  
  const onChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      [e.target.id] : e.target.value,
    }))
  }

  return (
    <div className="p-5">
      <header className="flex items-center justify-between">
        <p className="text-2xl font-black">My Profile</p>
        <button
          type="button"
          className="bg-green-500 shadow-lg text-white  font-black p-2 rounded-md"
          onClick={onLogout}
        >
          Logout
        </button>
      </header>

      <main className="py-3 mb-16">
        <div className="flex items-center justify-between">
          <p className="text-md">Personal Details</p>
        </div>

        <form  className="py-3">
        <div className="bg-white p-1 rounded-lg shadow-sm hover:shadow-none border border-gray-300 sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
        <div className="flex bg-white w-full px-2 py-2">
          <input
            type="text"
            id="name"
            value={name}
            className="flex-grow focus:outline-none placeholder:italic placeholder:text-slate-400 text-md font-black"
            disabled={!changeDetails}
            onChange={onChange}
          />
          <p className="text-sm text-green-500 cursor-pointer" onClick={() => {
            !changeDetails && onSubmit()

            setChangeDetails((prevState) => !prevState)
          }}>
            {!changeDetails ? 'Change' : 'Done'}
          </p>
        </div>

        <div className="flex bg-white w-full px-2 py-2">
          <input
            type="text"
            id="email"
            value={email}
            className="flex-grow focus:outline-none placeholder:italic placeholder:text-slate-400 text-md font-black"
            //disabled={!changeDetails}
            onChange={onChange}
          />
        </div>
        </div>
        </form>

        <Link to='/create-listing' className="flex justify-between items-center my-3 shadow-md hover:shadow-none rounded-lg bg-white w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl px-3 py-2">
          <HomeIcon className='w-5' />
          <p className="text-normal font-extrabold text-center flex-grow">sell / rent your house</p>
          <ChevronRightIcon className='w-5' />
        </Link>

        <Link to='/messages' className="flex justify-between items-center my-3 shadow-md hover:shadow-none rounded-lg bg-white w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl px-3 py-2">
          <ChatAlt2Icon className='w-5' />
          <p className="text-normal font-extrabold text-center flex-grow">Offers received</p>
          <ChevronRightIcon className='w-5' />
        </Link>

        <Link to='/my-listings' className="flex justify-between items-center my-3 shadow-md hover:shadow-none rounded-lg bg-white w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl px-3 py-2">
          <ClipboardIcon className='w-5' />
          <p className="text-normal font-extrabold text-center flex-grow">My listings</p>
          <ChevronRightIcon className='w-5' />
        </Link>
      </main>
    </div>
  );
};

export default Profile;
