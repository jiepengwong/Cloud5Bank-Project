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
  
    const email = "syuxiang99@gmail.com";
    const password = "Yuxiang1999!";
    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    // console.log(getSecretHash(email))

    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: UserPool,
    });

    // Start
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (session) => {
        console.log("User authenticated successfully");
        console.log("Session: ", session);
      },
      onFailure: (err) => {
        // Handle errors as before
        console.log(err)
      },
      mfaRequired: (codeDeliveryDetails) => {
        console.log("MFA is required");
        const mfaCode = prompt("Please enter MFA code");
        cognitoUser.sendMFACode(mfaCode, {
          onSuccess: (result) => {
            console.log("MFA code submitted successfully");
            console.log("Result: ", result);
          },
          onFailure: (err) => {
            console.log("Failed to submit MFA code:", err);
          },
        });
      },
    });
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