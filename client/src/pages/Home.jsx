import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NavbarComp from '../components/navbar'
import ActorButton from '../components/actorButton'
import Modal from '../components/Modal'

const Home = () => {
  const [data, setData] = useState([])
  const [actors, setActors] = useState([])
  
  const filmFiller = [{
    "description": " ",
    "rating": " ",
    "rental_duration": " ",
    "rental_rate": " "
  }]

  const actorFiller = [{
    "actor_name": " ",
    "total_films": " ",
    "top_films": []
  }]
  
  const [filmModInfo, setFilmModInfo] = useState(filmFiller)
  const [actorModInfo, setActorModInfo] = useState(actorFiller)
  const [showFilm, setShowFilm] = useState(false)
  const [showActor, setShowActor] = useState(false)
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

  const openFilmMod = async(film) => {
    await axios.get('http://localhost:5000/getFilmInfo/' + JSON.stringify(film.film_id))
    .then(res => {
      setFilmModInfo(res.data.Info)
      setModTitle(film.title)
    })
    .then(handleShowFilm)
    .catch(err => console.log(err))
  }

  const openActorMod = async(actorName) => {
    await axios.get('http://localhost:5000/getActorInfo/' + actorName)
    .then(res => {
      setActorModInfo(res.data)
      setModTitle(actorName)
    })
    .then(handleShowActor)
    .catch(err => console.log(err))
  }

  const handleCloseFilm = () => setShowFilm(false)
  const handleShowFilm = () => setShowFilm(true)
  const handleCloseActor = () => setShowActor(false)
  const handleShowActor = () => setShowActor(true)

  return (
    <div>
      <NavbarComp/>
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
                      onClick={() => openFilmMod(film)}
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
              <ActorButton key={index} onClick={() => openActorMod(actor)}>
                {actor}
              </ActorButton>
            ))
          }
        </div>
      </div>
      
      <Modal open={showFilm} onClose={handleCloseFilm} title={modTitle}>
        <div>
          <b>Description</b>: {filmModInfo[0].description} <br/>
          <b>Rating</b>: {filmModInfo[0].rating} <br/>
          <b>Rental Duration</b>: {filmModInfo[0].rental_duration} Days <br/>
          <b>Rental Rate</b>: ${filmModInfo[0].rental_rate} <br/>
          <b>Inventory</b>: {filmModInfo[0].inv} <br/>
          <b>Available</b>: {filmModInfo[0].number_available}
        </div>
      </Modal>

      <Modal open={showActor} onClose={handleCloseActor} title={modTitle}>
        <div>
          <b>Total Films</b>: {actorModInfo.total_films} <br/><br/>
          <b>Top 5 Rented Films</b>:<br/>
          <ul>
            {actorModInfo.top_films && actorModInfo.top_films.map((film, index) => (
              <li key={index}>{film.title} - Rented {film.rental_count} times</li>
            ))}
          </ul>
        </div>
      </Modal>
    </div>
  )
}

export default Home