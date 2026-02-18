import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NavbarComp from '../components/navbar'
import ActorButton from '../components/actorButton'
import HomeModal from '../components/HomeModal'
import FilmButton from '../components/filmButton'

const BUTTONCONTAINER_STYLES = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap:"20px",
    textAlign:"center",
    flex: 1
}

const BACKDROP_STYLES={
  height:"100vh",
  width:"100vw",
  background: "linear-gradient(315deg, #f0f0c0 0%, #E37107 55%, #f0f0c0 100%)"
}

const BUTTONRENTINFO_STYLES={
  position:"relative",
  textAlign:"center",
  bottom:"5px",
  top:"30%"
}

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
    <div style={BACKDROP_STYLES}>
      <NavbarComp/>
      <div className='container'>
        <h2 className='mt-3' style={{textAlign:"center"}}>Top 5 Rented Films</h2>
        <div style={BUTTONCONTAINER_STYLES}>
          {
            data.map((film) => (
              <FilmButton key={film.film_id} onClick={() => openFilmMod(film)}>
                {film.title} <br/>
                <div style={BUTTONRENTINFO_STYLES}>
                  <font size="x-small">
                    Times Rented: <br/>{film.rental_count}
                  </font>
                </div>
              </FilmButton>
            ))
          }
        </div>

        <h2 className='mt-5' style={{textAlign:"center"}}>Top 5 Actors</h2>
        <div className='mt-3' style={BUTTONCONTAINER_STYLES}> 
          {
            actors.map((actor, index) => (
              <ActorButton key={index} onClick={() => openActorMod(actor)}>
                  {actor}
              </ActorButton>
            ))
          }
        </div>
      </div>
      
      <HomeModal open={showFilm} onClose={handleCloseFilm} title={modTitle}>
        <div>
          <b>Description</b>: {filmModInfo[0].description} <br/>
          <b>Rating</b>: {filmModInfo[0].rating} <br/>
          <b>Rental Duration</b>: {filmModInfo[0].rental_duration} Days <br/>
          <b>Rental Rate</b>: ${filmModInfo[0].rental_rate} <br/>
          <b>Inventory</b>: {filmModInfo[0].inv} <br/>
          <b>Available</b>: {filmModInfo[0].number_available}
        </div>
      </HomeModal>

      <HomeModal open={showActor} onClose={handleCloseActor} title={modTitle}>
        <div>
          <b>Total Films</b>: {actorModInfo.total_films} <br/><br/>
          <b>Top 5 Rented Films</b>:<br/>
          <ul>
            {actorModInfo.top_films && actorModInfo.top_films.map((film, index) => (
              <li key={index}>{film.title} - Rented {film.rental_count} times</li>
            ))}
          </ul>
        </div>
      </HomeModal>

    </div>
  )
}

export default Home