import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import ListingItem from '../components/ListingItem';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';

const MyListings = () => {
  const [myListings, setMyListings] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate()
  const auth = getAuth();

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        const docsRef = collection(db, 'listings');

        const q = query(
          docsRef,
          where('userRef', '==', auth.currentUser.uid),
          orderBy('timestamp', 'desc')
        );

        const querySnapshot = await getDocs(q);

        const listings = [];

        querySnapshot.forEach((doc) => {
          listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setMyListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error('Could not fetch listings');
      }
    };

    fetchMyListings();
  }, [auth.currentUser.uid]);

  const onDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this listing? ')) {
      await deleteDoc(doc(db, 'listings', id));
      const updatedListings = myListings.filter((listing) => listing.id !== id);
      setMyListings(updatedListings);

      toast.success('successfully deleted');
    }
  };

  const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`)

  return (
    <>
      {loading ? (
        <Spinner />
      ) : myListings && myListings.length !== 0 ? (
        <div className="p-5">
          <header>
            <h1 className="text-2xl font-black">My listings</h1>
          </header>
          <main>
            {myListings.map((listing, id) => (
              <ListingItem
                listing={listing.data}
                id={listing.id}
                key={id}
                onDelete={() => onDelete(listing.id)}
                onEdit={() => onEdit(listing.id)}
              />
            ))}
          </main>
        </div>
      ) : (
        <div>You have no listing available</div>
      )}
    </>
  );
};

export default MyListings;
