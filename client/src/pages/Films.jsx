import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NavbarComp from '../components/navbar'
import DataTable from 'react-data-table-component'

const Films = () => {
const [data, setData] = useState([])
const [records, setRecords] = useState([]);

  useEffect(()=>{
    axios.get('http://localhost:5000/getFilms')
    .then(res=> {
      setData(res.data.films)
      setRecords(res.data.films)
    })
    .catch(err=>console.log(err))
  }, [])

  const columns = [
    {
      name: 'Film ID',
      cell: row=>(
        <div data-tag="allowRowEvents" onClick={e => handleRowClicked(e, row.film_id)} style={{ cursor: 'pointer' }}>
          {row.film_id}
        </div>
      ),
      sortable: true
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
      name: 'Last Update',
      selector: row=>row.last_update
    },
  ]

  function handleFilter(event){
      const value = event.target.value.toLowerCase()
      const newData = data.filter(
        row=> 
          row.title.toLowerCase().includes(value) ||
          row.name.toLowerCase().includes(value) ||
          JSON.stringify(row.film_id).includes(value)
        )
        setRecords(newData)
  }

  const [openPopup, setOpenPopup] = useState(false)

  // not working
  const handleRowClicked = (row, event) => {
      console.log(row.film_id)
      return(
      <div className="rounded-md p-4 bg-white popup">
        <div className = "flex flex-row justify-between">
          <h2>Popup</h2>
          <button onClick={()=>setOpenPopup(false)}></button>
        </div>
        <p className ="text-xl">Popup message here: </p>
      </div>
      )
  }

  return (
    <div>
      <NavbarComp/>

      <div className='container mt-5'>
        <input placeholder="Search" type="text" onChange={handleFilter}/>
        <DataTable columns={columns} data={records} fixedHeader pagination theme='light' onRowClicked={handleRowClicked} />
      </div>
    </div>
  )
}

export default Films