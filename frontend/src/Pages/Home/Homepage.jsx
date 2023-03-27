import './homepage.scss'
import React from 'react'
import CustomizedDialogs from '../../components/dialog/Dialog'

import Register from '../../components/register/Register'
import Login from '../../components/login/Login'

import { Button, TextField } from '@mui/material';import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';


// AWS Portion
import UserPool from '../../UserPool';
import { CognitoUserAttribute, AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import { getSecretHash } from "../../getSecretHash"; // Import your helper function here


function Homepage() {

  // Copy code
  const onSubmit = (event) => {
    event.preventDefault();
  
    const email = "htreborn";
    const password = "Yuxiang123!";
    const authDetails = new AuthenticationDetails({
      Username: "htreborn",
      Password: "Yuxiang1999@",
    });

    // console.log(getSecretHash(email))

    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: UserPool,
    });

    // Start
    // cognitoUser.authenticateUser(authDetails, {
    //   onSuccess: (session) => {
    //     alert("User authenticated successfully");
    //     console.log("Session: ", session);
    //   },
    //   onFailure: (err) => {
    //     // Handle errors as before
    //     console.log(err)
    //   },


    cognitoUser.authenticateUser(authDetails, {
      onSuccess: function(result) {
        console.log('Access token:', result.getAccessToken().getJwtToken());
        console.log('ID token:', result.getIdToken().getJwtToken());
        console.log('Refresh token:', result.getRefreshToken().getToken());
      },
      onFailure: function(err) {
        console.error(err);
      },
      newPasswordRequired: function(userAttributes, requiredAttributes) {
        // Filter out non-writable attributes
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
      // mfaRequired: (codeDeliveryDetails) => {
      //   console.log("MFA is required");
      //   const mfaCode = prompt("Please enter MFA code");
      //   cognitoUser.sendMFACode(mfaCode, {
      //     onSuccess: (result) => {
      //       console.log("MFA code submitted successfully");
      //       console.log("Result: ", result);
      //     },
      //     onFailure: (err) => {
      //       console.log("Failed to submit MFA code:", err);
      //     },
      //   });
      // },
    // End 
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
          <p>Spend, save, invest, and control your financial life</p>


          {/* Grid  */}
          <Grid container>
            <Grid item xs={12}>
              <TextField></TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField></TextField>
            </Grid>
          </Grid>
          <Button onClick={event => onSubmit(event)}>Sign In</Button>

        </section>
      </main>
    </div>
  )
}

export default Homepage