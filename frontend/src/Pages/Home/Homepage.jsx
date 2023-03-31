import './homepage.scss'
import { Icon } from '@iconify/react';
import React from 'react'
import CustomizedDialogs from '../../components/dialog/Dialog'
import { useState , useEffect } from 'react'

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
import { useDispatch ,useSelector } from 'react-redux'
import { set_access_token, set_id_token, set_roles, set_JWTToken, setClient_ID,setAddress,setEmail,setFamily_Name,setGender,setGivenName}  from "../../redux/features/everythingSlice";

// Import all the Functions from everythingSlice 

function Homepage() {
  const dispatch = useDispatch();
  // Temporary State: 
  const [credentials ,setcredentials] = useState(null)
  const [temp_id_token , set_temp_id_token] = useState(null)
  const [temp_access_token , set_temp_access_token ] = useState(null)
  const [temp_role, set_temp_role ] = useState(null);
  const [temp_refresh_token , set_temp_refresh_token ] = useState(null);

  // const [username, setusername] = useState("htreborn")
  // const [password, setpassword] = useState("Yuxiang1999@")

  // const [username, setusername] = useState("weiting123")
  // const [password, setpassword] = useState("weiting123@A")

  const [username, setusername] = useState("")
  const [password, setpassword] = useState("")

  const navigate = useNavigate();

  useEffect(() => {
    // If credentials are initialised, then we dispatch it to the global frame
    if (credentials) {
      console.log(credentials)
      console.log(temp_id_token)
      console.log(temp_access_token)
      console.log(temp_role)
      console.log(temp_refresh_token)

      // Push it to Global Frame: 
      dispatch(setClient_ID(credentials['sub']))
      dispatch(setAddress(credentials['address']))
      dispatch(setEmail(credentials['email']))
      dispatch(setFamily_Name(credentials['family_name']))
      dispatch(setGender(credentials['gender']))
      dispatch(setGivenName(credentials['given_name']))

      // Push it to Global Frame
      dispatch(set_access_token(temp_access_token))
      dispatch(set_id_token(temp_id_token))
      dispatch(set_roles(temp_role))
      dispatch(set_JWTToken(temp_access_token))

    }
  }, [credentials]);

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
        set_temp_id_token(result.getIdToken());
        set_temp_access_token(result.getAccessToken().getJwtToken());
        set_temp_refresh_token(result.getRefreshToken().getToken());
        
        // After I get back the Access token / ID Token, I will push the States to global state. 
        // Retrieve user attributes from the Cognito User Pool
      // Retrieve user attributes from the Cognito User Pool
      cognitoUser.getUserAttributes(function(err, attributes) {
        if (err) {
          console.error(err);
        } else {
          // Convert the array of user attributes to an object
          const userAttributes = attributes.reduce((obj, attribute) => {
            obj[attribute.getName()] = attribute.getValue();
            return obj;
          }, {});
          setcredentials(userAttributes);
        }
      });

        if (username == "weiting123") {
          set_temp_role("Admin")
        }
        else{
          set_temp_role("Customer")
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
    const globalJWT = useSelector((state) => state.every.jwtToken);


  return (
    <div className='homepage'>
      {/* <div className="parent-container"> */}
      <img src='https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L3JtMjA4YmF0Y2g0LWt3YW4tMDEtZy5qcGc.jpg' alt='bg'  className='homepage-bg'></img>
      <header>
        {/* <img src='https://api.iconify.design/bxs/bank.svg?color=white' alt='LOGO'></img> */}
        <Icon icon="oi:cloud" color="skyblue" width="80" height="80" />
        <h2>Cloud5Bank</h2>
        <Icon icon="oi:cloud" color="skyblue" width="80" height="80" />
      </header>

      <main>
        {/* <section> */}

          <h1>The ONLY bank you trust</h1>
        
          <p> Normal User details [UserDashboard] : Username: "htreborn",Password: "Yuxiang1999@" </p>
          <p> Admin User details [AdminDashboard]: Username: "weiting123",Password: "weiting123@A" </p>
          {/* <p> hi {globalJWT}</p> */}

          {/* Grid  */}
          <Grid container className="child-container">

            {/* <Grid item xs={12} marginBottom={3}>
              <TextField value={"htreborn"} sx={{backgroundColor:"white"}} fullWidth label="Username" onChange={event => setusername(event.target.value)}></TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField value={"Yuxiang1999@"} sx={{backgroundColor:"white"}} fullWidth label="Password" onChange={event => setpassword(event.target.value)}></TextField>
            </Grid> */}

            {/* <Grid item xs={12} marginBottom={3}>
              <TextField value={"weiting123"} sx={{backgroundColor:"white"}} fullWidth label="Username" onChange={event => setusername(event.target.value)}></TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField value={"weiting123@A"} sx={{backgroundColor:"white"}} fullWidth label="Password" onChange={event => setpassword(event.target.value)}></TextField>
            </Grid> */}

            <Grid item xs={12} marginBottom={3}>
              <TextField  sx={{backgroundColor:"white"}} fullWidth label="Username" onChange={event => setusername(event.target.value)}></TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField sx={{backgroundColor:"white"}} fullWidth label="Password" onChange={event => setpassword(event.target.value)}></TextField>
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