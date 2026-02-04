import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Customers = () => {
  const [data, setData] = useState([])

  useEffect(()=>{
    axios.get('http://localhost:5000/getCustomers')
    .then(res=> setData(res.data.customers))
    .catch(err=>console.log(err))
  }, [])

  return (
    
    <div className='container'>
        <div className='mt-3'>
            <table className='table'>
                <thead>
                    <tr>
                        <th>customer_id</th>
                        <th>first_name</th>
                        <th>last_name</th>
                        <th>active</th>
                        <th>address_id</th>
                        <th>create_date</th>
                        <th>email</th>
                        <th>last_update</th>
                        <th>store_id</th>
                    </tr>
                </thead>
                <tbody>
                    {
                    data.map((user) => {
                        return <tr key={user.customers_id}>
                        <td>{user.customer_id}</td>
                        <td>{user.first_name}</td>
                        <td>{user.last_name}</td>
                        <td>{user.active}</td>
                        <td>{user.address_id}</td>
                        <td>{user.create_date}</td>
                        <td>{user.email}</td>
                        <td>{user.last_update}</td>
                        <td>{user.store_id}</td>
                        </tr>                
                        })
                    }

                </tbody>
            </table>
        </div>
    </div>
  )
}

export default Customers
