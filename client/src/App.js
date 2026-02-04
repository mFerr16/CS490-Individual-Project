import React, { useState, useEffect } from 'react'


import Customers from './pages/Customers'
import NavbarComp from './components/navbar'



const App = () => {

  return (
    <div>
      <div>
        <NavbarComp/>
        <Customers/>
      </div>
    </div>
  )
}

export default App