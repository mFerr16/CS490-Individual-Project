import React from 'react'


function SuccesMSG({show}) {
  if(!show){return null}
  return (
    <div className="alert alert-success">
        <strong>Success!</strong>
    </div>
  )
}

export default SuccesMSG