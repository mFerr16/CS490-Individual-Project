import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'

const MODAL_STYLES={
  position: "fixed",
  top:"50%",
  left:"50%",
  transform:"translate(-50%, -50%)",
  backgroundColor:"#FFF",
  paddingTop:"50px",
  paddingBottom:"50px",
  paddingRight:"25px",
  zIndex:1000,
}

const OVERLAY_STYLES={
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex:1000,
}

const BUTTON_STYLES={
  position:"fixed",
  background:"none",
  border:"none",
  top:"10px",
  right:"10px",
  height:"5px"
}

const RENTBUTTON_STYLES={
  position: "fixed",
  borderRadius: "25px",
  left: "37%",
  backgroundColor: "#73AD21",
  width:"20%",
  alignItems: "center",
}

const MODHEAD_STYLES={
  position:"fixed",
  backgroundColor:"#112ae7de",
  top:0,
  left:0,
  right:0,
  height:"20%",
}

const TITLE_STYLES={
  position:"fixed",
  background:"none",
  border:"none",
  top:"10px",
  left:"10px",
  height:"5px",
}

const BODY_STYLES={
  position:"relative",
  top:"15px",
  left:"25px",
  paddingRight:"15px",
  overflow:"hidden"
}

export default function Modal({ open, children, onClose, title, filmId }) {
  const [customers, setCustomers] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    if (open) {
      axios.get('http://localhost:5000/getCustomers')
      .then(res => setCustomers(res.data.customers))
      .catch(err => console.log(err))
    }
  }, [open])

  function handleRent() {
    if (!selectedCustomer) {
      alert("Please select a customer")
      return
    }

    const data = {
      film_id: filmId,
      customer_id: selectedCustomer
    }

    axios.post('http://localhost:5000/rentFilm', data)
    .then(res => {
      alert(res.data.message)
      setShowDropdown(false)
      setSelectedCustomer("")
      onClose()
    })
    .catch(err => {
      if (err.response) {
        alert(err.response.data.message)
      } else {
        alert("Error renting film")
      }
    })
  }

  if (!open) return null
  
  return ReactDOM.createPortal(
    <>
      <div style={OVERLAY_STYLES}>
        <div style={MODAL_STYLES}>
          <div style={MODHEAD_STYLES}>
            <p style={TITLE_STYLES}>
              <font color="white">
                {title}
              </font>
            </p>
            <button style={BUTTON_STYLES} onClick={onClose}>
              <font color="#FFFF">
                X
              </font>
            </button>
          </div>
          <div style={BODY_STYLES}>
            {children}
            
            {!showDropdown && (
              <button style={RENTBUTTON_STYLES} onClick={() => setShowDropdown(true)}>
                <font color="white">
                  RENT
                </font>
              </button>
            )}

            {showDropdown && (
              <div>
                <br/><br/>
                <select 
                  value={selectedCustomer} 
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  style={{width: "80%", padding: "5px"}}
                >
                  <option value="">Select Customer</option>
                  {customers.map(customer => (
                    <option key={customer.customer_id} value={customer.customer_id}>
                      {customer.first_name} {customer.last_name}
                    </option>
                  ))}
                </select>
                <br/><br/>
                <button 
                  onClick={handleRent}
                  style={{...RENTBUTTON_STYLES, backgroundColor: "#73AD21"}}
                >
                  <font color="white">CONFIRM RENT</font>
                </button>
                <button 
                  onClick={() => setShowDropdown(false)}
                  style={{...RENTBUTTON_STYLES, left: "60%", backgroundColor: "#d21e1e"}}
                >
                  <font color="white">CANCEL</font>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>,
    document.getElementById("portal")
  )
}