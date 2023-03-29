import './App.scss';
import React, { useContext } from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'

import Homepage from './Pages/Home/Homepage';
import AdminPanel from './Pages/AdminPanel/AdminPanel'
import UserDashboard from './Pages/UserDashboard/UserDashboard'
import { AuthContext } from './context/Auth-context';
import { useSelector,useDispatch } from 'react-redux';

function App() {

  // console.log(isAdmin)
  const globalJWT = useSelector((state) => state.every.jwtToken);
  const role = useSelector((state) => state.every.roles);


  console.log(globalJWT);

  return (
    <div className="App">
      {globalJWT !== ""
        ?
        role === 'Admin'
          ?
          <Routes>
            <Route path='/adminpanel/*' element={<AdminPanel/>}/>
            <Route path="*" element={<Navigate to ="/adminpanel" replace/>}/>
          </Routes>
          :
          <Routes>
            <Route path='/userdashboard/*' element={<UserDashboard/>}/>
            <Route path="*" element={<Navigate to ="/userdashboard" replace/>}/>
          </Routes>
        :
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path="*" element={<Navigate to ="/" replace/>}/>
        </Routes>
       } 
    </div>
  )
}

export default App;