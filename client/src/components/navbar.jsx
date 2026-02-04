import React from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';

import Customers from '../pages/Customers';

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link
} from "react-router-dom";

const NavbarComp = () => {

    function getCustomerList(){
      return <Customers/>
    }

  return (
    <Router>
      <Navbar bg="light" data-db-theme="dark">
        <Container>
          <Navbar.Brand href="#home">Sakila</Navbar.Brand>
          <Nav className = "ms-auto">
            <Nav.Link href = "/">Home</Nav.Link>
            <Nav.Link href = "/">Films</Nav.Link>
            <Nav.Link href="/Customers">Customers</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Routes>
            <Route path='/Customers' element={<getCustomerList/>}/>
        </Routes>
    </Router>


  )
}

export default NavbarComp