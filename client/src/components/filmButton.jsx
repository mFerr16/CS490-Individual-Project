import React from 'react'

const BUTTON_STYLES={
  borderRadius: "25px",
  backgroundColor: "#000000",
  bordercolor:"#ffff",
  padding: "20px",
  width: "15%",
  height: "250px",
  alignItems: "center",
  cursor: "pointer",
  marginright:"10px",
}

const FilmButton = ({children, onClick}) => {

  return (
        <button style={BUTTON_STYLES} size='lg' onClick={onClick}>
            <font color="white">
                {children}
            </font>
        </button>
  )
}

export default FilmButton