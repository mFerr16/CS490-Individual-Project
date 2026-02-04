import React from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';

import Customers from '../pages/Customers';
import { Link } from 'react-router-dom';

const NavbarComp = () => {

  return (
      <Navbar bg="light" data-db-theme="dark">
        <Container>
          <Navbar.Brand href="/Home">Sakila</Navbar.Brand>
          <Nav className = "ms-auto">
            <Nav.Link href = "/Home">Home</Nav.Link>
            <Nav.Link href = "/Film">Films</Nav.Link>
            <Nav.Link href="/Customers">Customers</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
  )
}

export default NavbarComp