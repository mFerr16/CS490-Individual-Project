import React from 'react'
import { Button } from 'react-bootstrap'

const ActorButton = ({FName, LName, A_ID}) => {
    const [data, setData] = useState([])

  useEffect(()=>{
    axios.get('http://localhost:5000/topActors')
    .then(res=> setData(res.data.actors))
    .catch(err=>console.log(err))
  }, [])

  return (
        <Button size='lg'>
          
        </Button>
  )
}

export default ActorButton