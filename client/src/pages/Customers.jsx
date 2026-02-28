import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NavbarComp from '../components/navbar'
import DataTable from 'react-data-table-component'
import CustomerModal from '../components/editCustomer'
import { CgInfo } from "react-icons/cg"
import AddCustomerModal from '../components/addCustomer'

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

const ADDBUTTON_STYLES={
    backgroundColor: "#73AD21",
    borderRadius: "5px",
    alignText:"center"
}

const Customers = () => {
  const [data, setData] = useState([])
  const [records, setRecords] = useState([])
  const [show, setShow] = useState(false)
  const [ID, setID] = useState({})
  const [AID, setAID] = useState({})
  const [rentalMod, setRentalMod] = useState(false)
  const [addMod, setAddMod] = useState(false)

  useEffect(()=>{
    axios.get('http://localhost:5000/getCustomers')
    .then(res=> {
        setData(res.data.customers)
        setRecords(res.data.customers)
    })
    .catch(err=>console.log(err))
  }, [])

  const handleClose = () => setShow(false);
  const handleShow  = () => setShow(true);
  const rentMod     = () => setRentalMod(true);

  const addCust     = () => setAddMod(true);
  const closeAdd    = () => setAddMod(false);

  const columns=[
    {
      name: "",
      sortable: false,
      button: "true",
      cell: row=>(
        <button style={{background:'none', border:'none'}} onClick={()=>rentMod(row)}><CgInfo/></button>
      )
    },
    {
        name: "ID",
        selector: row=>row.customer_id,
        sortable: true,
        width:"5rem"
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
        name: "Address",
        selector: row=>row.address,
        rem:"25rem"
    },
    {
        name: "Postal Code",
        selector: row=>row.postal_code,
        width:"7rem"
    },
    {
        name: "Email",
        selector: row=>row.email,
        width:"18rem"
    },
    {
        name: "Phone",
        selector: row=>row.phone,
        width:"8rem"
    },
    {
        name: "Address",
        selector: row=>row.address_id,
        omit: "True"
    },
    {
        name: "",
        cell: row=>(<button style={EDITBUTTON_STYLES} onClick={()=>{setID(row.customer_id); setAID(row.address_id); handleShow()}}>Edit</button>),
        width:"10rem"
    },

  ]

  function handleFilter(event){
      const value = event.target.value.toLowerCase()
      const newData = data.filter(
        row=> 
          row.first_name.toLowerCase().includes(value) ||
          row.last_name.toLowerCase().includes(value) ||
          JSON.stringify(row.customer_id) === value
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
        <button onClick={addCust} style={ADDBUTTON_STYLES}>
            <font style={{color:"#ffff", fowWeight:"bold"}}>
                <b><b>+</b></b>
            </font>
        </button>
        <DataTable columns={ columns } data={ records } pagination fixedHeader/>
    </div>
    <CustomerModal open={show} onClose={handleClose} ID={ID} AddresID={AID}/>
    <AddCustomerModal open={addMod} onClose={closeAdd}/>
  </div>
  )
}

export default Customers
