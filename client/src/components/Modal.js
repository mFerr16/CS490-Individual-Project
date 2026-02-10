import React from 'react'
import ReactDOM from 'react-dom';

const MODAL_STYLES={
  position: "fixed",
  top:"50%",
  left:"50%",
  transform:"translate(-50%, -50%)",
  backgroundColor:"#FFF",
  padding:"50px",
  zIndex:1000
}

const OVERLAY_STYLES={
  postition:"relative",
  top:0,
  left:0,
  right:0,
  bottom:0,
  backgroundColor:"rgba(0, 0, 0, .7)",
  zIndex:1000
}

const BUTTON_STYLES={
  position:"fixed",
  background:"none",
  border:"none",
  top:"10px",
  right:"10px",
  height:"5px"
}

const MODALHEADER_STYLES={
  height: "10%",
  width: "50%",
  top: 0,
  backgroundColor:"#4444444",

}

export default function Modal( { open, children, onClose } ) {
  if(!open) return null 
  return ReactDOM.createPortal(
    <>
      <div style={OVERLAY_STYLES}></div>  
      <div style={MODAL_STYLES}>
        <div styles={MODALHEADER_STYLES}>
          <button style={BUTTON_STYLES} onClick={onClose}>X</button>
        </div>
        {children}

      </div>

    </>,
    document.getElementById("portal")
  )
}
