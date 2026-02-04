import React from 'react'
import { Button } from 'react-bootstrap'

const ActorButton = ({FName, LName, A_ID}) => {
  return (
        <Button size='lg'>
            {FName}<br> {LName}</br>
        </Button>
  )
}

export default ActorButton