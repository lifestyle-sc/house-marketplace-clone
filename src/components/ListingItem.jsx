import { Link } from 'react-router-dom';
import { ReactComponent as DeleteIcon } from '../assets/svg/deleteIcon.svg';
import { ReactComponent as EditIcon } from '../assets/svg/editIcon.svg';
import BedIcon from '../assets/svg/bedIcon.svg';
import BathtubIcon from '../assets/svg/bathtubIcon.svg';

const ListingItem = ({ listing, id, onDelete, onEdit }) => {
  return (
    <div className="py-4 flex gap-2 relative">
      <Link to={`/category/${listing.type}/${id}`}>
        <img
          className="w-36 max-w-none h-28 md:w-64 md:h-36 rounded-lg"
          src={listing.imageUrls[0]}
          alt={listing.name}
        />
      </Link>

      <div className="flex flex-col gap-1 py-2">
        <p className="text-xs md:text-sm font-semibold">{listing.location}</p>
        <p className="text-sm md:text-lg font-extrabold">{listing.name}</p>
        <p className="text-sm md:text-lg text-green-500 font-extrabold">
          $
          {listing.offer
            ? listing.discountedPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            : listing.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}    
          {listing.type === 'rent' && ' / Month' }
        </p>
        <div className="flex gap-1 md:gap-2 items-center">
        <img src={BedIcon} className='w-5' alt="Bedroom" />
        <p className="text-xs font-bold">{
          listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : '1 Bedroom'
        }</p>

        <img src={BathtubIcon} className='w-5' alt="Bathroom" />
        <p className="text-xs font-bold">{
          listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` : '1 Bathroom'
        }</p>
      </div>
      </div>
      {onDelete && <DeleteIcon className='w-5 absolute bottom-10 right-0 cursor-pointer' fill='rgb(231, 76, 60)' onClick={() => onDelete(listing.id)} />}

      {onEdit && <EditIcon className='w-5 absolute top-5 right-0 cursor-pointer' onClick={() => onEdit(listing.id)} />}
    </div>
  );
};

export default ListingItem;
