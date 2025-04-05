import React from 'react'
import Header from '../Components/Header/Header'
import Categories from '../Components/Categories/Categories'
import Newstock from '../Components/NewStock/Newstock'
import NewsLetter from '../Components/NewsLetter/NewsLetter'
const HomePage = () => {
  return (
    <div>
      <Header />
      <Categories />
      <Newstock />
      <NewsLetter />
    </div>
  )
}

export default HomePage