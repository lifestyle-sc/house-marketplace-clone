import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  limit,
  startAfter,
  orderBy,
  getDocs,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import ListingItem from '../components/ListingItem';

const Offers = () => {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ lastFetchListings, setLastFetchListings ] = useState(null)

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const docsRef = collection(db, 'listings');
        const q = query(
          docsRef,
          where('offer', '==', true),
          orderBy('timestamp', 'desc'),
          limit(10)
        );
        const querySnap = await getDocs(q);

        const lastVisible = querySnap.docs[querySnap.docs.length - 1]

        setLastFetchListings(lastVisible)

        const listing = [];

        querySnap.forEach((doc) => {
          return listing.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        //console.log(listing);

        setListings(listing);
        setLoading(false);
      } catch (error) {
        toast.error('Could not fetch listings');
      }
    };

    fetchListings();
  }, []);

  // pagination or fetch more
  const onFetchMoreListings = async () => {
    try {
      const docsRef = collection(db, 'listings');
      const q = query(
        docsRef,
        where('offer', '==', true),
        orderBy('timestamp', 'desc'),
        startAfter(lastFetchListings),
        limit(10)
      );
      const querySnap = await getDocs(q);

      const lastVisible = querySnap.docs[querySnap.docs.length - 1]

      setLastFetchListings(lastVisible)

      const listing = [];

      querySnap.forEach((doc) => {
        return listing.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      //console.log(listing);

      setListings((prevState) => ([ ...prevState, ...listing ]));
      setLoading(false);
    } catch (error) {
      toast.error('Could not fetch listings');
    }
  };

  return (
    <div className="p-5">
      <header className="mb-3">
        <h2 className="text-2xl font-black">
          Offers
        </h2>
      </header>

      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main className='mb-16'>
            <ul>
              {listings.map((doc) => (
                <ListingItem listing={doc.data} id={doc.id} key={doc.id} />
              ))}
            </ul>
          </main>

          {lastFetchListings && (
            <p className='text-green-500 text-lg cursor-pointer text-center mb-16' onClick={onFetchMoreListings}>
              Load More
            </p>
          )}
        </>
      ) : (
        <p className="text-lg font-semibold">
          There are no offers currently
        </p>
      )}
    </div>
  );
};

export default Offers;
