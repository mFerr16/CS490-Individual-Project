import React from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';

import Customers from '../pages/Customers';
import { Link } from 'react-router-dom';

const NavbarComp = () => {

  return (
      <Navbar style={{backgroundColor:"#f58f5c"}} data-db-theme="dark">
        <Container>
          <Navbar.Brand href="/Home">Sakila</Navbar.Brand>
          <Nav className = "ms-auto">
            <Nav.Link href = "/Home">
              <font color="white">
                Home
              </font>
            </Nav.Link>
            <Nav.Link href = "/Films">
              <font color="white">
                Films
              </font>
            </Nav.Link>
            <Nav.Link href="/Customers">
              <font color="white">
                Customers
              </font>
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
  )
}

export default NavbarComp