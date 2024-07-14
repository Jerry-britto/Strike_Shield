import {useEffect} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Admin() {

  const user = useSelector(state=>state.user)
  const navigate = useNavigate()

  useEffect(()=>{
    if(user && user.length === 0){
      navigate("/")
    }
  })

  return (
    <div className='flex justify-center items-center bg-red-500 p-2'>Welcome Admin</div>
  )
}

export default Admin