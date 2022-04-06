import { useEffect, useState, useRef } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const useAuthStatus = () => {
  const [ loggedIn, setLoggedIn ] = useState(false)
  const [ loading, setLoading ] = useState(true)
  const isMounted = useRef(true)

  useEffect(() => {
    if (isMounted.current) {
    const auth = getAuth()

    onAuthStateChanged(auth, (user) => {
      if(user){
        setLoggedIn(true)
      }
      setLoading(false)
    })

    return () => {
      isMounted.current = false
    }
  }
  }, [])
  return { loggedIn, loading }
}

export default useAuthStatus