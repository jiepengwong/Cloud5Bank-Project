import './homepage.scss'
import React from 'react'
import CustomizedDialogs from '../../components/dialog/Dialog'

import Register from '../../components/register/Register'
import Login from '../../components/login/Login'
import { useNavigate } from 'react-router-dom'

// Import AWS
import AWS from 'aws-sdk';

AWS.config.update({ region: 'ap-southeast-1' });

function Homepage() {
  const navigate = useNavigate();
  
  const urlSearchParams = new URLSearchParams(window.location.search);
  const code = urlSearchParams.get('code');

  if (!code) {
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
  
            <div className='homepage-sign-btns'>
              <CustomizedDialogs title='Sign in' btn='Sign in'>
                <Register/>
              </CustomizedDialogs>
  
  
            </div>
  
          </section>
        </main>
      </div>
    )
  }
  else {
    // Use the code to check with the Cognito Side 
    const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

    async function getUserInfo(code) {
      try {
        const response = await cognitoidentityserviceprovider.getUser({
          AccessToken: code
        }).promise();

        return response.UserAttributes.reduce((acc, curr) => {
          console.log(curr.Value)
          acc[curr] = curr.Value;
          return acc;
        }, {});
      } catch (error) {
        console.error(error);
        return null;
      }
    }
    const userInfo = getUserInfo(code);
    console.log(userInfo)

    // Populate the Use Context. 
    navigate("/adminpanel/*");
  }
}

export default Homepage