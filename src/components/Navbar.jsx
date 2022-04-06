import { UserIcon, GiftIcon, LocationMarkerIcon } from '@heroicons/react/outline'
import { useNavigate, useLocation } from 'react-router-dom'
const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const matchLocationPath = (route) => {
    if(location.pathname === route) return true

    return false
  }

  return (
    <footer className='bg-gray-100 fixed bottom-0 left-0 w-full py-3'>
      <nav>
        <ul className='flex align-center justify-evenly'>
          <li className='transition-all duration-500 ease-in-out hover:mb-1 cursor-pointer'>
            <LocationMarkerIcon className={`w-7 h-7 ${matchLocationPath('/') ? 'text-black': 'text-gray-400'}`} onClick={() => navigate('/')}/>
            <p className={`text-xs font-bold ${matchLocationPath('/') ? 'text-black' : 'text-gray-400'}`}>Explore</p>
          </li>

          <li className='transition-all duration-500 ease-in-out hover:mb-1 cursor-pointer'>
            <GiftIcon className={`w-7 h-7 ${matchLocationPath('/offer') ? 'text-black': 'text-gray-400'}`} onClick={() => navigate('/offer')} />
            <p className={`text-xs font-bold ${matchLocationPath('/offer') ? 'text-black' : 'text-gray-400'}`}>Offers</p>
          </li>

          <li className='transition-all duration-500 ease-in-out hover:mb-1 cursor-pointer'>
            <UserIcon className={`w-7 h-7 ${matchLocationPath('/profile') ? 'text-black': 'text-gray-400'}`} onClick={() => navigate('/profile')} />  
            <p className={`text-xs font-bold ${matchLocationPath('/profile') ? 'text-black' : 'text-gray-400'}`}>Profile</p>
          </li>
        </ul>
      </nav>
    </footer>
  )
}

export default Navbar