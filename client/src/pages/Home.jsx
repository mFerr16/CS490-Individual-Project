import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NavbarComp from '../components/navbar'

const Home = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    axios.get('http://localhost:5000/topRentedFilms')
    .then(res => setData(res.data["Top Rented Films"]))
    .catch(err => console.log(err))
  }, [])

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
                  <td>{film.title}</td>
                  <td>{film.rental_count}</td>
                </tr>
              })
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Home