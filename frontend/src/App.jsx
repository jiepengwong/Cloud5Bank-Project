import './App.scss';
import React, { useContext,useEffect } from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'

import Homepage from './Pages/Home/Homepage';
import AdminPanel from './Pages/AdminPanel/AdminPanel'
import UserDashboard from './Pages/UserDashboard/UserDashboard'
import { AuthContext } from './context/Auth-context';
import { useSelector,useDispatch } from 'react-redux';
import { set_roles } from './redux/features/everythingSlice';

function App() {

  
  // console.log(isAdmin)
  const roles = useSelector(state => state.every.roles);
  const jwtToken = useSelector(state => state.every.jwtToken);
  
  console.log(jwtToken);
  console.log(roles);
  
  useEffect(() => {
    // If credentials are initialised, then we dispatch it to the global frame
    console.log('Global JWT:', jwtToken);
    console.log('Role:', roles);
  }
  , [jwtToken,roles])
  
  return (
    <div className="App">
      {jwtToken !== ""
        ?
        roles === 'Admin'
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