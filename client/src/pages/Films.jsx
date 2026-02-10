import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NavbarComp from '../components/navbar'
import DataTable from 'react-data-table-component'
import { CgInfo } from "react-icons/cg"
import Modal from '../components/Modal'

const MODHEAD_STYLES={
  position:"fixed",
  background:"none",
  border:"none",
  top:0,
  left:"10px",
  height:"5px"
}

const Films = () => {

  const [data, setData] = useState([])
  const [records, setRecords] = useState([]);
  const [modInfo, setModInfo] = useState([]);

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
    {
      name: "",
      sortable: false,
      button: "true",
      cell: row=>(
        <button style={{background:'none', border:'none'}} onClick={()=>openMod(row)}><CgInfo/></button>
      ),
      allowOverFlow: true
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
    }
    
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

  return (
    <>
      <div>
        <NavbarComp/>

        <div className='container mt-5'>
          <input placeholder="Search" type="text" onChange={handleFilter}/>
          <DataTable columns={columns} data={records} fixedHeader pagination theme='light' />
        </div>
        <Modal open={show} onClose={handleClose}>
            <div style={MODHEAD_STYLES}>
              <p>{modTitle}</p>
            </div>
            <div>
              Description: {modInfo.description} <br/>
              Rating: {modInfo.rating} <br/>
              Rental Duration: {modInfo.rental_duration} <br/>
              Rental Rate: {modInfo.rental_rate} <br/>
            </div>
        </Modal>
      </div>
    </>
  )
}

export default Films