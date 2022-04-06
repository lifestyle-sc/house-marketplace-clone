import { useState } from 'react';
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/outline';
import {
  EyeIcon,
  EyeOffIcon,
  LockClosedIcon,
  MailIcon,
} from '@heroicons/react/solid';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import Oauth from '../components/Oauth';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      [e.target.id] : e.target.value,
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      const auth = getAuth()

      const userCredential = await signInWithEmailAndPassword(auth, email, password)

      const user = userCredential.user

      if(user) navigate('/')
      
    } catch (error) {
      toast.error('Wrong user credentials!')
    }
  }

  return (
    <div className="p-4 md:p-6">
      <header className="pb-2">
        <h1 className="font-black text-2xl">Welcome Back!</h1>
      </header>

      <form className="mt-4" onSubmit={onSubmit}>
        <div className="flex mb-4 bg-white w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl hover:shadow-lg focus-within:shadow-lg rounded-full px-3 py-2 border border-gray-300">
          <MailIcon className="h-5 pr-2" />
          <input
            type="email"
            id="email"
            value={email}
            className="flex-grow focus:outline-none placeholder:italic placeholder:text-slate-400 sm:text-sm"
            placeholder="Email"
            onChange={onChange}
          />
        </div>

        <div className="flex mb-4 bg-white w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl hover:shadow-lg focus-within:shadow-lg rounded-full px-3 py-2 border border-gray-300">
          <LockClosedIcon className="h-5 pr-2" />
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            className="flex-grow focus:outline-none placeholder:italic placeholder:text-slate-400 sm:text-sm"
            placeholder="Password"
            onChange={onChange}
          />
          {showPassword ? (
            <EyeIcon className="h-5 cursor-pointer" onClick={() => setShowPassword(prevState => !prevState)}/>
          ) : (
            <EyeOffIcon className="h-5 cursor-pointer" onClick={() => setShowPassword(prevState => !prevState)}/>
          )}
        </div>

        <div className="flex justify-end w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mb-4 px-2">
        <Link to='/forgot-password' className='text-green-500 font-bold cursor-pointer transition-all duration-400 ease-in hover:text-green-400'>Forgot Password</Link>
        </div>

        <div className="mt-8 flex items-center justify-between md:justify-start w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mb-4 px-2">
            <h2 className="font-black text-xl pr-2">Sign in</h2>
            <button type='submit' className="bg-green-500 rounded-full p-2 cursor-pointer shadow-lg hover:shadow-none">
            <ChevronRightIcon className='h-5 text-white'/>
            </button>
        </div>
      </form>

      <Oauth />

      <div className="mt-8 flex justify-center w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mb-4 px-2">
        <Link to='/sign-up' className='text-green-500 font-bold cursor-pointer transition-all duration-400 ease-in hover:text-green-400'>Sign Up Instead</Link>
        </div>
    </div>
  );
};

export default SignIn;
