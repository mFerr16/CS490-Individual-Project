import React from 'react'
import Customers from './pages/Customers'
import Home from './pages/Home'
import NavbarComp from './components/navbar'
import Films from './pages/Films'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

const App = () => {
  <Home/>
  return (
      <Router>
        <Routes>
          <Route path="/" element={ <Home/> } />
          <Route path="/Home" element={ <Home/> } />
          <Route path="/Customers" element={ <Customers/> } />
          <Route path="/Films" element={ <Films/> } />
        </Routes>
      </Router>
  )
}

export default App