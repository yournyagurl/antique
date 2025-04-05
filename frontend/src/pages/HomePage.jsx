import React from 'react'
import Header from '../Components/Header/Header'
import Categories from '../Components/Categories/Categories'
import Newstock from '../Components/NewStock/Newstock'
const HomePage = () => {
  return (
    <div>
      <Header />
      <Categories />
      <Newstock />
    </div>
  )
}

export default HomePage