import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NavbarComp from '../components/navbar'
import { Table } from 'react-bootstrap'

const Films = () => {
const [data, setData] = useState([])

  useEffect(()=>{
    axios.get('http://localhost:5000/getFilms')
    .then(res=> setData(res.data.films))
    .catch(err=>console.log(err))
  }, [])

  return (
    <div>
        <NavbarComp/>
      <div className='container'>
          <div className='mt-3'>
              <table className='table'>
                  <thead>
                      <tr>
                          <th>Tilm ID</th>
                          <th>Title</th>
                          <th>Category</th>
                          <th>Rating</th>
                          <th>Last Update</th>
                      </tr>
                  </thead>
                  <tbody>
                    {
                      data.map((user)=>{
                        return <tr key={user.film_id}>
                            <td>{user.film_id}</td>
                            <td>{user.title}</td>
                            <td>{user.name}</td>
                            <td>{user.rating}</td>
                            <td>{user.last_update}</td>
                        </tr>
                      
                      })
                    }
                  </tbody>
              </table>
          </div>
      </div>

    </div>
  )
}

export default Films