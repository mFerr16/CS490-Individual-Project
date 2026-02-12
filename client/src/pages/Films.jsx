import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NavbarComp from '../components/navbar'
import DataTable from 'react-data-table-component'
import { CgInfo } from "react-icons/cg"
import Modal from '../components/Modal'

const Films = () => {

 const filler = [{
  "description": " ",
  "rating": " ",
  "rental_duration": " ",
  "rental_rate": " "
 }]

  const [data, setData] = useState([])
  const [records, setRecords] = useState([]);
  const [modInfo, setModInfo] = useState(filler);

  const [show, setShow] = useState(false);
  const [modTitle, setModTitle] = useState("");
  
          
  useEffect(()=>{
    axios.get('http://localhost:5000/getFilms')
    .then(res=> {
      setData(res.data.films)
      setRecords(res.data.films)
    })
    .catch(err=>console.log(err))
  }, [])
  
  const openMod = async(row)=>{ 
    await axios.get('http://localhost:5000/getFilmInfo/'+JSON.stringify(row.film_id)).then(res=> {
      setModInfo(res.data.Info);
      setModTitle(row.title);
      console.log(modInfo)
    }).then(handleShow).catch(err=>console.log(err))
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const columns = [
    //width: '3rem' 
    {
      name: "",
      sortable: false,
      button: "true",
      cell: row=>(
        <button style={{background:'none', border:'none'}} onClick={()=>openMod(row)}><CgInfo/></button>
      )
    },
    {
      name: 'Film ID',
      selector: row=>row.film_id,
      sortable: true
    },
    {
      name: 'Title',
      selector: row=>row.title,
      sortable: true,
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
    {
      name: 'actors',
      selector: row=>row.actors,
      omit: true
    }
    
  ]

  function handleFilter(event){
      const value = event.target.value.toLowerCase()
      const newData = data.filter(
        row=> 
          row.title.toLowerCase().includes(value) ||
          row.name.toLowerCase().includes(value) ||
          row.actors.toLowerCase().includes(value) ||
          JSON.stringify(row.film_id) === value
        )
        setRecords(newData)
  }

  return (
    <>
      <div>
        <NavbarComp/>
        <div className='container mt-5'>
          <input placeholder="Search" type="text" onChange={handleFilter}/>
          <DataTable show={false} columns={columns} data={records} fixedHeader pagination theme='light' />
        </div>
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
      </div>
    </>
  )
}

export default Films