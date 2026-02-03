import React, { useState, useEffect } from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {

  const [data, setData] = useState([{}])
  useEffect(()=>{
    fetch("/members").then(
      res=>res.json()
    ).then(
      data=>{
        setData(data)
        console.log(data)
      }
    )

  }, [])



  return (
    <div>
      <Navbar bg="light" data-db-theme="dark">
        <Container>
          <Navbar.Brand href="#home">Sakila</Navbar.Brand>
          <Nav classname = "ms-auto">
            <Nav.Link href = "/">Home</Nav.Link>
            <Nav.Link href = "/">Films</Nav.Link>
            <Nav.Link href = "/">Customers</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      
      {(typeof data.members === 'undefined') ? (
        <p>Loading...</p>
      ):(
        data.members.map((member, i) => (
          <p key={i}>{member}</p>

        ))
      )}

    </div>
  )
}

export default App