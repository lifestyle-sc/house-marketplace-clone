import { useNavigate, useLocation } from 'react-router-dom'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import googleIcon from '../assets/svg/googleIcon.svg'

const Oauth = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const onGoogleClick = async() => {
    try {
      const auth = getAuth()
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      const docRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(docRef)

      // check if user doesn't exist
      if(!docSnap.exists()){
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        })
      }
      navigate('/')
      
    } catch (error) {
      toast.error("Could not authenticate with Google")
      console.log(error)
    }
  }
  return (
    <div className='p-5 flex flex-col items-center justify-center w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl'>
      <p className="text-md">Sign {location.pathname === '/sign-up'? 'up' : 'in'} with</p>
      <button className="bg-white rounded-full p-4 mt-5 shadow-lg hover:shadow-none" onClick={onGoogleClick}>
        <img className='h-5 w-5' src={googleIcon} alt="google Icon" />
      </button>
    </div>
  )
}

export default Oauth