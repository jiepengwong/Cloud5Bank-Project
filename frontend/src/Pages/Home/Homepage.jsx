import './homepage.scss'
import React from 'react'
import CustomizedDialogs from '../../components/dialog/Dialog'

import Register from '../../components/register/Register'
import Login from '../../components/login/Login'
import { useNavigate } from 'react-router-dom'

import Button from '@mui/material/Button';

import Amplify, { Auth } from 'aws-amplify';




// Import AWS
import AWS from 'aws-sdk';
// import { SignIn } from '@aws-amplify/ui-react/lib/Auth';
const { SignIn } = require('@aws-amplify/ui-react');


AWS.config.update({ region: 'ap-southeast-1' });

function Homepage() {
  const navigate = useNavigate();
  
  const urlSearchParams = new URLSearchParams(window.location.search);
  const code = urlSearchParams.get('code');

  async function signOut() {
    try {
        await Auth.signOut();
    } catch (error) {
        console.log('error signing out: ', error);
    }
  }
  async function signIn() {
    try {
        const username ="yxsong.2020@scis.smu.edu.sg";
        const password = "Yuxiang123!"
        const user = await Auth.signIn(username, password);
        console.log(user);
    } catch (error) {
        console.log('error signing in', error);
    }
  }
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
              <Button onClick={() => signIn()}>Sign In</Button>

              <Button onClick={()=> signOut()}>Sign Out</Button>
  
  
            </div>
  
          </section>
        </main>
      </div>
    )
  }
}

export default Homepage;