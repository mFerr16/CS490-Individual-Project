import React from 'react'

const BUTTON_STYLES={
  borderRadius: "25px",
  backgroundColor: "#73AD21",
  padding: "20px",
  width: "200px",
  height: "300px",
  alignItems: "center",
  overflowWrap: "break-word"
}


const ActorButton = ({children}) => {

  return (
        <button style={BUTTON_STYLES} size='lg'>
          <div>
            {children}
          </div>
        </button>
  )
}

export default ActorButton