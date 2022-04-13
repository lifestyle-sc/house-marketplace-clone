import { Link } from "react-router-dom"
import RentCategoryImage from '../assets/jpg/rentCategoryImage.jpg'
import SellCategoryImage from '../assets/jpg/sellCategoryImage.jpg'
import Slider from "../components/Slider"

const Explore = () => {
  return (
    <div className="p-5">
      {/* <header className="mb-2">
      <h1 className="text-2xl font-black">
          Explore
      </h1>
      </header> */}

      <main className="mb-16">
        <Slider />

        <div className="my-5">
          <h3 className="text-lg font-black">Category</h3>
            <div className="flex gap-4">
              <Link className="my-3" to='/category/rent'>
                <img className="w-44 md:max-w-96 rounded-lg" src={RentCategoryImage} alt="rent" />

                <p className="mt-3 font-bold text-md">Places for rent</p>
              </Link>

              <Link className="my-3" to='/category/sale'>
                <img className="w-44 md:max-w-96 rounded-lg" src={SellCategoryImage} alt="sell" />
                <p className="mt-3 font-bold text-md">Places for sale</p>
              </Link>
            </div>
        </div>
      </main>
    </div>
  )
}

export default Explore