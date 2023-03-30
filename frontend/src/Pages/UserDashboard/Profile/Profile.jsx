import "./profile.scss"
import React from 'react'
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { useContext } from "react";
import { AuthContext } from "../../../context/Auth-context";

import { useSelector } from "react-redux";

function Profile() {
  const roles = useSelector(state => state.every.roles);
  const ClientId = useSelector(state => state.every.clientID);
  const address = useSelector(state => state.every.address);
  const email = useSelector(state => state.every.email);
  const family_name = useSelector(state => state.every.family_name);
  const gender = useSelector(state => state.every.gender);
  const givenName = useSelector(state => state.every.givenName);

  return (
    <div className="profile">

      <div className="title">
        <h2>Profile</h2>
      </div>

      <div className="profile-contanier">

        <AccountBoxIcon className="icon"/>

        <div className="profile-details">

          <p>Client ID</p>
          <h3>{ClientId}</h3>

          <p>Role:</p>
          <h3>{roles}</h3>

          <p>Address:</p>
          <h3>{address}</h3>
          
          <p>Email: </p>
          <h3>{email}</h3>

          <p>Family Name: </p>
          <h3>{family_name}</h3>

          <p>Gender: </p>
          <h3>{gender}</h3>

          <p>Given Name: </p>
          <h3>{givenName}</h3>
          
        </div>

      </div>
    </div>
  )
}

export default Profile