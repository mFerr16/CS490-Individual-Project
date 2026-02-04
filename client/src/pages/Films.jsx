import React from 'react'
import NavbarComp from '../components/navbar'

const Films = () => {
const [data, setData] = useState([])

  useEffect(()=>{
    axios.get('http://localhost:5000/getFilms')
    .then(res=> setData(res.data.customers))
    .catch(err=>console.log(err))
  }, [])
  return (
    <div>
        <NavbarComp/>
        <div>
        </div>
    </div>
  )
}

export default Films