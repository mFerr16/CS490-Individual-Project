import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NavbarComp from '../components/navbar'
import ActorButton from '../components/actorButton'
<<<<<<< HEAD
import { Container } from 'react-bootstrap'

const ACTOR_STYLES={
  bottom:"50%",
  height:"50%",
  alignItems: "center"
}
=======
import Modal from '../components/Modal'
>>>>>>> 1db5eb2ea7915a5cb31dfa0f5bfd554ffdaf575b

const Home = () => {
  const [data, setData] = useState([])
  const [actors, setActors] = useState([])
  
  const filler = [{
    "description": " ",
    "rating": " ",
    "rental_duration": " ",
    "rental_rate": " "
  }]
  
  const [modInfo, setModInfo] = useState(filler)
  const [show, setShow] = useState(false)
  const [modTitle, setModTitle] = useState("")

  useEffect(() => {
    axios.get('http://localhost:5000/topRentedFilms')
    .then(res => setData(res.data["Top Rented Films"]))
    .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    axios.get('http://localhost:5000/topActors')
    .then(res => setActors(res.data["Actors"]))
    .catch(err => console.log(err))
  }, [])

  const openMod = async(film) => {
    await axios.get('http://localhost:5000/getFilmInfo/' + JSON.stringify(film.film_id))
    .then(res => {
      setModInfo(res.data.Info)
      setModTitle(film.title)
    })
    .then(handleShow)
    .catch(err => console.log(err))
  }

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  return (
    <div>
      <div>
        <NavbarComp/>
      </div>
      <div className='container'>
        <h2 className='mt-3'>Top 5 Rented Films</h2>
        <table className='table mt-3'>
          <thead>
            <tr>
              <th>Title</th>
              <th>Times Rented</th>
            </tr>
          </thead>
          <tbody>
            {
              data.map((film) => {
                return <tr key={film.film_id}>
                  <td>
                    <button 
                      style={{background:'none', border:'none', color:'black', cursor:'pointer', textDecoration:'none', padding:0, textAlign:'left'}} 
                      onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                      onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                      onClick={() => openMod(film)}
                    >
                      {film.title}
                    </button>
                  </td>
                  <td>{film.rental_count}</td>
                </tr>
              })
            }
          </tbody>
        </table>

        <h2 className='mt-5'>Top 5 Actors</h2>
        <div className='mt-3'>
          {
            actors.map((actor, index) => (
              <ActorButton key={index}>
                {actor}
              </ActorButton>
            ))
          }
        </div>
      </div>
<<<<<<< HEAD
      {/*
      <div style={ACTOR_STYLES}>
        <Container>
          <ActorButton>
            test1
          </ActorButton>
          <ActorButton>
            test2
          </ActorButton>
          <ActorButton>
            test3
          </ActorButton>
          <ActorButton>
            test4
          </ActorButton>
          <ActorButton>
            test5
          </ActorButton>
        </Container>
      </div>*/}
=======
      
      <Modal open={show} onClose={handleClose} title={modTitle}>
        <div>
          <b>Description</b>: {modInfo[0].description} <br/>
          <b>Rating</b>: {modInfo[0].rating} <br/>
          <b>Rental Duration</b>: {modInfo[0].rental_duration} Days <br/>
          <b>Rental Rate</b>: ${modInfo[0].rental_rate} <br/>
          <b>Inventory</b>: {modInfo[0].inv} <br/>
          <b>Available</b>: {modInfo[0].number_available}
        </div>
      </Modal>
>>>>>>> 1db5eb2ea7915a5cb31dfa0f5bfd554ffdaf575b
    </div>
  )
}

export default Home