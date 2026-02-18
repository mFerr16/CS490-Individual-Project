import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NavbarComp from '../components/navbar'
import DataTable from 'react-data-table-component';

const EDITBUTTON_STYLES={
    alignItems: "center",
    backgroundColor:"#6b6b6b9f"
}

const BACKDROP_STYLES={
  minheight:"100%",
  height:"125vh",
  width:"100vw",
  background:"linear-gradient(315deg, #f0f0c0 0%, #E37107 55%, #f0f0c0 100%)"
}


const Customers = () => {
  const [data, setData] = useState([])
  const [records, setRecords] = useState([]);

  useEffect(()=>{
    axios.get('http://localhost:5000/getCustomers')
    .then(res=> {
        setData(res.data.customers)
        setRecords(res.data.customers)
    })
    .catch(err=>console.log(err))
  }, [])

  const columns=[
    {
        name: "Customer ID",
        selector: row=>row.customer_id,
        sortable: true,
        width:"8rem"
    },
    {
        name: "First Name",
        selector: row=>row.first_name,
        width:"7rem"
    },
    {
        name: "Last Name",
        selector: row=>row.last_name,
        width:"7rem"
    },
    {
        name: "Active",
        selector: row=>row.active,
        width:"5rem"
    },
    {
        name: "Address ID",
        selector: row=>row.address_id,
        width:"6rem"
    },
    {
        name: "Create Date",
        selector: row=>row.create_date,
        width:"14rem"
    },
    {
        name: "Email",
        selector: row=>row.email,
        width:"20rem"
    },
    {
        name: "",
        cell: row=>(<button style={EDITBUTTON_STYLES} onClick={()=>console.log("WIP")}>Edit</button>),
        width:"10rem"
    },

  ]

  function handleFilter(event){
      const value = event.target.value.toLowerCase()
      const newData = data.filter(
        row=> 
          row.first_name.toLowerCase().includes(value) ||
          row.last_name.toLowerCase().includes(value) ||
          JSON.stringify(row.customer_id).includes(value)
        )
        setRecords(newData)
  }

  return (

    <div style={BACKDROP_STYLES}>
        <div>
            <NavbarComp/>
        </div>
    <div className='container mt-5'>
        <input placeholder="Search" type="text" onChange={handleFilter} style={{background:"none"}}/>
        <DataTable columns={ columns } data={ records } pagination fixedHeader/>
    </div>
  </div>
  )
}

export default Customers
