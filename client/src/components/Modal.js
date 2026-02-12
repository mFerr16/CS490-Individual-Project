import React from 'react'
import ReactDOM from 'react-dom';

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

export default function Modal( { open, children, onClose, title } ) {
  if(!open) return null 
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
          </div>
        </div>
      </div>
    </>,
    document.getElementById("portal")
  )
}
