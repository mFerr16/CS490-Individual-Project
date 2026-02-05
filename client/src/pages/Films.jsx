import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NavbarComp from '../components/navbar'
import { Table } from 'react-bootstrap'

const Films = () => {
const [data, setData] = useState([])

  useEffect(()=>{
    axios.get('http://localhost:5000/getFilms')
    .then(res=> setData(res.data.customers))
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
                          <th>film</th>
                          <th>title</th>
                          <th>rating</th>
                          <th>last update</th>
                      </tr>
                  </thead>
                  <tbody>
                  </tbody>
              </table>
          </div>
      </div>

    </div>
  )
}

export default Films