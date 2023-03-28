import './homepage.scss'
import React from 'react'
import CustomizedDialogs from '../../components/dialog/Dialog'
import { useState } from 'react'

import Register from '../../components/register/Register'
import Login from '../../components/login/Login'

import { Button, TextField, Typography } from '@mui/material';import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';


// AWS Portion
import UserPool from '../../UserPool';
import { CognitoUserAttribute, AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import { getSecretHash } from "../../getSecretHash"; // Import your helper function here


function Homepage() {

  const [username, setusername] = useState("")
  const [password, setpassword] = useState("")

  const onSubmit = (event) => {
    event.preventDefault();
  
    const authDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: UserPool,
    });
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: function(result) {
        alert("You have successfully Logged In.")
        console.log('Access token:', result.getAccessToken().getJwtToken());
        console.log('ID token:', result.getIdToken().getJwtToken());
        console.log('Refresh token:', result.getRefreshToken().getToken());
      },
      onFailure: function(err) {
        console.error(err);
      },
      newPasswordRequired: function(userAttributes, requiredAttributes) {
        // Filter out non-writable attributes

        alert("You have to change your password! ")
        const writableAttributes = Object.keys(userAttributes).reduce((result, key) => {
          if (!requiredAttributes.includes(key)) {
            result[key] = userAttributes[key];
          }
          return result;
        }, {});
    
        // Prompt the user to enter a new password
        const newPassword = prompt('Please enter a new password:');
    
        // Complete the new password challenge
        cognitoUser.completeNewPasswordChallenge(newPassword, {
          onSuccess: function(result) {
            console.log('ID token:', result.getIdToken().getJwtToken());
            console.log('Refresh token:', result.getRefreshToken().getToken());
          },
          onFailure: function(err) {
            console.error(err);
          }
        });
      }
    });
  };

  return (
    <div className='homepage'>
      <img src='https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L3JtMjA4YmF0Y2g0LWt3YW4tMDEtZy5qcGc.jpg' alt='bg'  className='homepage-bg'></img>
      <header>
        <img src='https://api.iconify.design/bxs/bank.svg?color=white' alt='LOGO'></img>
        <h2>Sprints Bank</h2>
      </header>

      <main>
        <section>

          <h1>The bank you trust</h1>
          <p> Username: "htreborn",Password: "Yuxiang1999@" </p>


          {/* Grid  */}
          <Grid container>
            <Grid item xs={12} marginBottom={3}>
              <TextField sx={{backgroundColor:"white"}} fullWidth label="Username" onChange={event => setusername(event.target.value)}></TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField sx={{backgroundColor:"white"}} fullWidth label="Password" onChange={event => setpassword(event.target.value)}></TextField>
            </Grid>
            
            <Grid item xs={12}>
                <Button onClick={event => onSubmit(event)}>Sign In</Button>
            </Grid>
          </Grid>
          

        </section>
      </main>
    </div>
  )
}

export default Homepage