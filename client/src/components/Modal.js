import React from 'react'
import ReactDOM from 'react-dom';

const MODAL_STYLES={
  position: "fixed",
  top:"50%",
  left:"50%",
  transform:"translate(-50%, -50%)",
  backgroundColor:"#FFF",
  padding:"50px",
  zIndex:1000,
}

const OVERLAY_STYLES={
  postition:"fixed",
  top:0,
  left:0,
  right:0,
  bottom:0,
  width:"100%",
  height:"100%",
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

const MODHEAD_STYLES={
  position:"fixed",
  backgroundColor:"#112ae7de",
  top:0,
  left:0,
  right:0,
  height:"20%"
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
  position:"absolute",
  left:"10px",
}

export default function Modal( { open, children, onClose, title } ) {
  if(!open) return null 
  return ReactDOM.createPortal(
    <>
      <div style={OVERLAY_STYLES}/> 
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
        {children}
      </div>
    </>,
    document.getElementById("portal")
  )
}
