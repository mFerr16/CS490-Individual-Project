import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NavbarComp from '../components/navbar'
import DataTable from 'react-data-table-component'

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
        sortable: true
    },
    {
        name: "First Name",
        selector: row=>row.first_name
    },
    {
        name: "Last Name",
        selector: row=>row.last_name
    },
    {
        name: "Active",
        selector: row=>row.active
    },
    {
        name: "Address ID",
        selector: row=>row.address_id
    },
    {
        name: "Create Date",
        selector: row=>row.create_date
    },
    {
        name: "Email",
        selector: row=>row.email
    },
    {
        name: "Last Update",
        selector: row=>row.last_update
    }
    
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

    <div>
        <NavbarComp/>
    <div className='container mt-5'>
        <input placeholder="Search" type="text" onChange={handleFilter}/>
        <DataTable columns={ columns } data={ records } pagination fixedHeader/>
    </div>
  </div>
  )
}

export default Customers
