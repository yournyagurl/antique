import React from 'react'
import { Link } from 'react-router-dom'
import './Categories.css'


const categories = [
    { id: 1, name: 'FURNITURE', image: "https://res.cloudinary.com/dtqvxfc7w/image/upload/v1743722134/image_uzuyxf.png", link: '/inventory/furniture' },
    { id: 2, name: 'COLLECTIBLES', image: "https://res.cloudinary.com/dtqvxfc7w/image/upload/v1743722670/Collectors-Porcelain-Plate-Snow-Maiden-Snegurochka-by-A_gopctt.webp", link: '/inventory/collectibles' },
    { id: 3, name: 'ART AND BOOKS', image: "https://res.cloudinary.com/dtqvxfc7w/image/upload/v1743722160/gallerylabohememanchester-21_kvqpxx.webp", link: '/inventory/arts' },
    { id: 4, name: 'ODDITIES', image: "https://res.cloudinary.com/dtqvxfc7w/image/upload/v1743445606/product_images/product_1743445604306.jpg", link: '/inventory/miscellaneous' },
  ];
const Categories = () => {
  return (
    <div className="categories">
      {/* Title on the left */}
      <div className="categories-text">
        <h1>EXPLORE OUR COLLECTION</h1>
      </div>

      {/* Category Images in Circles */}
      <div className="categories-list">
        {categories.map((category) => (
          <Link to={category.link} key={category.id} className="category-item">
            <img src={category.image} alt={category.name} />
            <p>{category.name}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Categories