import './homepage.scss'
import React from 'react'
import CustomizedDialogs from '../../components/dialog/Dialog'
import { useState } from 'react'

import Register from '../../components/register/Register'
import Login from '../../components/login/Login'

import { Button, TextField, Typography } from '@mui/material';import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';


// AWS Portion
import UserPool from '../../UserPool';
import { CognitoUserAttribute, AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import { getSecretHash } from "../../getSecretHash"; // Import your helper function here
import { useDispatch } from 'react-redux'
import { set_access_token, set_id_token,set_roles , set_JWTToken} from "../../redux/features/everythingSlice";

// Import all the Functions from everythingSlice 

function Homepage() {
  const dispatch = useDispatch();

  const [username, setusername] = useState("htreborn")
  const [password, setpassword] = useState("Yuxiang1999@")
  const [isLoggedIn, setLoggedIn] = useState(false)

  const [jiepeng, setjiepeng ] = useState("")
  const navigate = useNavigate();

  const onSubmit =  async (event) => {
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
      onSuccess: async function(result) {
        alert("You have successfully Logged In.")
        // setLoggedIn(true)
        console.log(result)

  
        const access_token = result.getAccessToken().getJwtToken();
        const id_token = result.getIdToken();
        const refresh_id = result.getRefreshToken().getToken()

        console.log(id_token);
        console.log(access_token);
        console.log(refresh_id);

        // Push it to global variable 
        dispatch(set_access_token(result.getAccessToken()))
        dispatch(set_id_token(result.getIdToken()))
        dispatch(set_JWTToken(result.getAccessToken().getJwtToken()))

        if (username == "weiting123") {
          dispatch(set_roles("Admin"))
        }
        else{
          dispatch(set_roles("Customer"))
        }

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

    // const navigate = useNavigate();
    // if(username == 'htreborn'){
    //   navigate('/userdashboard')
    // }
    // else{
    //   navigate('/adminpanel')
    // }

  };


  //register 

    const [usernameReg, setUsernameReg] = useState('');
    const [emailReg, setEmailReg] = useState('');
    const [passwordReg, setPasswordReg] = useState('');
    const [givenNameReg, setGivenNameReg] = useState('');
    const [familyNameReg, setFamilyNameReg] = useState('');
    // const [preferredUsernameReg, setPreferredUsernameReg] = useState('');
    const [genderReg, setGenderReg] = useState('');
    const [birthdateReg, setBirthdateReg] = useState('');
    const [addressReg, setAddressReg] = useState('');

    //cant onSubmit 2 times in the same file 
    const onclick = (e) => {
      e.preventDefault();
      const attributeList = [];

      attributeList.push(
        new CognitoUserAttribute({
          Name: 'email',
          Value: emailReg,
        })
      );

      attributeList.push(
        new CognitoUserAttribute({
          Name: 'given_name',
          Value: givenNameReg,
        })
      );
    
      attributeList.push(
        new CognitoUserAttribute({
          Name: 'family_name',
          Value: familyNameReg,
        })
      );
    
      // attributeList.push(
      //   new CognitoUserAttribute({
      //     Name: 'preferred_username',
      //     Value: preferredUsernameReg,
      //   })
      // );
    
      attributeList.push(
        new CognitoUserAttribute({
          Name: 'gender',
          Value: genderReg,
        })
      );
    
      attributeList.push(
        new CognitoUserAttribute({
          Name: 'birthdate',
          Value: birthdateReg,
        })
      );
    
      attributeList.push(
        new CognitoUserAttribute({
          Name: 'address',
          Value: addressReg,
        })
      );

      UserPool.signUp(usernameReg, passwordReg, attributeList, null, (err, data) => {
        if (err) {
          console.log(err);
          alert("Couldn't sign up");
        } else {
          console.log(data);
          alert('User Added Successfully');

          // console.log("tetest", cognitoUser)

          // const cognitoUser = data.user;
          // cognitoUser.confirmRegistration(confirmCode, true, (err, result) => {
          //   if (err) {
          //     console.log(err);
          //     alert("Couldn't confirm the account");
          //   } else {
          //     console.log(result);
          //     // Add the user details, including preferred username
          //     cognitoUser.updateAttributes(attributeList, (err, result) => {
          //       if (err) {
          //         console.log(err);
          //         alert("Couldn't update user attributes");
          //       } else {
          //         console.log(result);
          //         alert('User Added Successfully');
          //       }
          //     });
          //   }
          // });

        }
      });
    };

  return (
    <div className='homepage'>
      {/* <div className="parent-container"> */}
      <img src='https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L3JtMjA4YmF0Y2g0LWt3YW4tMDEtZy5qcGc.jpg' alt='bg'  className='homepage-bg'></img>
      <header>
        <img src='https://api.iconify.design/bxs/bank.svg?color=white' alt='LOGO'></img>
        <h2>Sprints Bank</h2>
      </header>

      <main>
        {/* <section> */}

          <h1>The bank you trust</h1>
          <p> Normal User details [UserDashboard] : Username: "htreborn",Password: "Yuxiang1999@" </p>
          <p> Admin User details [AdminDashboard]: Username: "weiting123",Password: "weiting123@A" </p>


          {/* Grid  */}
          <Grid container className="child-container">

            <Grid item xs={12} marginBottom={3}>
              <TextField value={"htreborn"} sx={{backgroundColor:"white"}} fullWidth label="Username" onChange={event => setusername(event.target.value)}></TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField value={"Yuxiang1999@"} sx={{backgroundColor:"white"}} fullWidth label="Password" onChange={event => setpassword(event.target.value)}></TextField>
            </Grid>
            
            <Grid item xs={12}>
                <Button onClick={event => onSubmit(event)}>Sign In</Button>
            </Grid>

          </Grid>

          <Grid container className="child-container">

            <h1>Register with Us!</h1>
            <p>Username:htreborn, Email: cloud5bank.cme@gmail.com, Pass:Yuxiang1999@, GivenName:Yuxiang, FamilyName: Song,  Gender: Male, BD: 28.03.1999, Address: Bishan  </p>

            {/* <p>To Register for a new Account</p> */}
            <Grid item xs={12} marginBottom={3}>
              <TextField sx={{backgroundColor:"white"}} fullWidth label="Enter Username" onChange={(e) => setUsernameReg(e.target.value)}></TextField>
            </Grid>

            <Grid item xs={12} marginBottom={3}>
              <TextField sx={{backgroundColor:"white"}} fullWidth label="Enter Email" onChange={(e) => setEmailReg(e.target.value)}></TextField>
            </Grid>

            <Grid item xs={12} marginBottom={3}>
              <TextField sx={{backgroundColor:"white"}} fullWidth label="Enter Password" onChange={(e) => setPasswordReg(e.target.value)}></TextField>
            </Grid>

            <Grid item xs={12} marginBottom={3}>
              <TextField sx={{backgroundColor:"white"}} fullWidth label="Enter Given Name" onChange={(e) => setGivenNameReg(e.target.value)}></TextField>
            </Grid>

            <Grid item xs={12} marginBottom={3}>
              <TextField sx={{backgroundColor:"white"}} fullWidth label="Enter Family Name" onChange={(e) => setFamilyNameReg(e.target.value)}></TextField>
            </Grid>

            {/* <Grid item xs={12} marginBottom={3}>
              <TextField sx={{backgroundColor:"white"}} fullWidth label="Enter Preferred Username" onChange={(e) => setPreferredUsernameReg(e.target.value)}></TextField>
            </Grid> */}

            <Grid item xs={12} marginBottom={3}>
              <TextField sx={{backgroundColor:"white"}} fullWidth label="Enter Gender" onChange={(e) => setGenderReg(e.target.value)}></TextField>
            </Grid>

            <Grid item xs={12} marginBottom={3}>
              <TextField sx={{backgroundColor:"white"}} fullWidth label="Enter Birthdate" onChange={(e) => setBirthdateReg(e.target.value)}></TextField>
            </Grid>

            <Grid item xs={12} marginBottom={3}>
              <TextField sx={{backgroundColor:"white"}} fullWidth label="Enter Address" onChange={(e) => setAddressReg(e.target.value)}></TextField>
            </Grid>

            <Grid item xs={12}>
                <Button onClick={event => onclick(event)}>Register</Button>
            </Grid>


          </Grid>
          

        {/* </section> */}
      </main>
      {/* </div> */}
    </div>
  )
}

export default Homepage