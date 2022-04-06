import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { query, collection, where, orderBy, limit, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import MessageItem from '../components/MessageItem';
import Spinner from '../components/Spinner';

const Messages = () => {
  const [ loading, setLoading ] = useState(true)
  const [ messages, setMessages ] = useState(null)

  const auth = getAuth()

  useEffect(() => {
    const fetchMessages = async () => {
      const messagesRef = collection(db, 'offers')
      const q = query(
        messagesRef,
        where('landlordEmail', '==', auth.currentUser.email),
        orderBy('timestamp', 'desc'))

        const querySnap = await getDocs(q)

        const offers = []

        querySnap.forEach((doc) => {
          offers.push({
            id : doc.id,
            data: doc.data()
          })
        })

        setMessages(offers)
        setLoading(false)

        console.log(offers)
    }


    fetchMessages()
  }, [auth.currentUser.email])

  const onDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message? ')) {
      await deleteDoc(doc(db, 'offers', id));
      const updatedMessages = messages.filter((message) => message.id !== id);
      setMessages(updatedMessages);

      toast.success('successfully deleted');
    }
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : messages && messages.length !== 0 ? (
        <div className="p-5">
          <header>
            <h1 className="text-2xl font-black">Offers Received</h1>
          </header>
          <main>
            {messages.map((message, id) => (
              <MessageItem
                message={message.data}
                id={message.id}
                key={id}
                onDelete={() => onDelete(message.id)}
              />
            ))}
          </main>
        </div>
      ) : (
        <div className='p-5 font-bold'>You have received no offer</div>
      )}
    </>
  );
};

export default Messages;
