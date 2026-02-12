import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NavbarComp from '../components/navbar'
import ActorButton from '../components/actorButton'
import { Container } from 'react-bootstrap'

const ACTOR_STYLES={
  bottom:"50%",
  height:"50%",
  alignItems: "center"
}

const Home = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    axios.get('http://localhost:5000/topRentedFilms')
    .then(res => setData(res.data["Top Rented Films"]))
    .catch(err => console.log(err))
  }, [])

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
                  <td>{film.title}</td>
                  <td>{film.rental_count}</td>
                </tr>
              })
            }
          </tbody>
        </table>
      </div>
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
    </div>
  )
}

export default Home