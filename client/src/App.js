import React from 'react'
import Customers from './pages/Customers'
import Home from './pages/Home'
import NavbarComp from './components/navbar'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

const App = () => {

  return (
      <Router>
        <Routes>
          <Route path="/Home" element={ <Home/> }/>
          <Route path="/Customers" element={ <Customers/> }/>
        </Routes>
      </Router>
  )
}

export default App