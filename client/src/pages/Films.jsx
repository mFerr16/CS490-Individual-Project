import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NavbarComp from '../components/navbar'
import DataTable from 'react-data-table-component'

const Films = () => {
const [data, setData] = useState([])
  useEffect(()=>{
    axios.get('http://localhost:5000/getFilms')
    .then(res=> setData(res.data.films))
    .catch(err=>console.log(err))
  }, [])

  const columns = [
    {
      name: 'Film ID',
      selector: row=>row.film_id
    },
    {
      name: 'Title',
      selector: row=>row.title,
      sortable: true
    },
    {
      name: 'Category',
      selector: row=>row.name,
      sortable: true
    },
    {
      name: 'Rating',
      selector: row=>row.rating
    },
    {
      name: 'Last Update',
      selector: row=>row.last_update
    },
  ]


  const [records, setRecords] = useState(data);

  function handleFilter(event){
      const newData = records.filter(
        row=> {
          return row.film_id.toLowerCase().includes(event.target.value.toLowerCase())
        })
        setRecords(newData)
  }


  return (
    <div>
      <NavbarComp/>

      <div className='container mt-5'>
        <input placeholder="Search" type="text" onChange={handleFilter}/>
        <DataTable columns={columns} data={data} fixedHeader pagination />
      </div>
    </div>
  )
}

export default Films