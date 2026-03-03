import React from 'react'
import ReactDOM from 'react-dom'

const MODAL_STYLES={
  position: "fixed",
  top:"50%",
  left:"50%",
  transform:"translate(-50%, -50%)",
  backgroundColor:"#FFF",
  paddingTop:"50px",
  paddingBottom:"50px",
  paddingRight:"25px",
  width:"40vw",
  maxHeight:"80vh",
  overflow:"auto",
  zIndex:1000,
}

const OVERLAY_STYLES={
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  zIndex:1000,
}

const BUTTON_STYLES={
  position:"fixed",
  background:"none",
  border:"none",
  right:"1%",
  top:"10px",
  height:"5px"
}

const MODHEAD_STYLES={
  position:"fixed",
  backgroundColor:"#112ae7de",
  top:0,
  left:0,
  right:0,
  height:"7%",
}

const BODY_STYLES={
  position:"relative",
  top:"15px",
  left:"25px",
  paddingRight:"15px",
  paddingBottom:"25px",
}

export default function RentalHistoryModal({ open, onClose, customer, rentals }) {
  if (!open) return null

  return ReactDOM.createPortal(
    <>
      <div style={OVERLAY_STYLES}>
        <div style={MODAL_STYLES}>
          <div style={MODHEAD_STYLES}>
            <button style={BUTTON_STYLES} onClick={onClose}>
              <font color="#FFFF">X</font>
            </button>
          </div>
          <div style={BODY_STYLES}>
            <h3>Rental History: {customer.first_name} {customer.last_name}</h3>
            
            <h4>Current Rentals:</h4>
            {rentals.current_rentals && rentals.current_rentals.length > 0 ? (
              <ul>
                {rentals.current_rentals.map((rental, index) => (
                  <li key={index}>
                    <b>{rental.title}</b> - Rented: {new Date(rental.rental_date).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No current rentals</p>
            )}

            <h4>Past Rentals:</h4>
            {rentals.past_rentals && rentals.past_rentals.length > 0 ? (
              <ul>
                {rentals.past_rentals.map((rental, index) => (
                  <li key={index}>
                    <b>{rental.title}</b> - Returned: {new Date(rental.return_date).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No past rentals</p>
            )}
          </div>
        </div>
      </div>
    </>,
    document.getElementById("portal")
  )
}