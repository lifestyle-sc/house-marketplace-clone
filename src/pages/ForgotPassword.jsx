import { useState } from 'react'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { MailIcon, ChevronRightIcon } from '@heroicons/react/solid'

const ForgotPassword = () => {
  const [ email, setEmail ] = useState()

  const onChange = (e) => setEmail(e.target.value)

  const onSubmit = async(e) => {
    e.preventDefault()

    try {
      const auth = getAuth()

      await sendPasswordResetEmail(auth, email)

      toast.success("Reset email sent")
      
    } catch (error) {
      toast.error("Couldn't send reset email!")
    }
  }
  return (
    <div className='p-4 space-x-5'>
      <header className="mb-4">
        <h1 className="text-2xl font-black">Forgot Password</h1>
      </header>
      <form onSubmit={onSubmit}>
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
        <div className="flex justify-end w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mb-4 px-2">
        <Link to='/sign-in' className='text-green-500 font-bold cursor-pointer transition-all duration-400 ease-in hover:text-green-400'>Sign In</Link>
        </div>

        <div className="mt-10 flex items-center justify-between md:justify-start w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mb-4 px-2">
            <h2 className="font-black text-xl pr-2">Send Reset Email</h2>
            <button type='submit' className="bg-green-500 rounded-full p-2 cursor-pointer shadow-lg hover:shadow-none">
            <ChevronRightIcon className='h-5 text-white'/>
            </button>
        </div>
      </form>
    </div>
  )
}

export default ForgotPassword