import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from 'react-router-dom'
import {QueryClientProvider, QueryClient} from 'react-query'
import { AuthProvider } from './context/Auth-context';
import { ThemeProvider } from '@mui/material';
import { theme } from './theme';
// import awsconfig from './aws-exports';


// Amplify AWS  
// Configure AWS SDK

import { Amplify, Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
import AWS from 'aws-sdk';
import { CognitoUserPool } from 'amazon-cognito-identity-js';


// Configure AWS Amplify
Amplify.configure(awsconfig);

const userPool = new CognitoUserPool({
  UserPoolId: 'ap-southeast-1_uldoanBJO',
  ClientId: 's3qtr2qr1m73t6keq2b9t3sk4',
});

const cognitoUser = userPool.getCurrentUser();

if (cognitoUser != null) {
  cognitoUser.getSession((err, session) => {
    if (err) {
      console.error(err);
      return;
    }

    AWS.config.region = 'ap-southeast-1'; // Region
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'ap-southeast-1:06e1b42f-9e31-4104-b71a-074efe141741',
    });

    const queryClient = new QueryClient();

    ReactDOM.render(
      <BrowserRouter>
        <React.StrictMode>
          <AuthProvider>
            <QueryClientProvider client={queryClient}>
              <ThemeProvider theme={theme}>
                <App />
              </ThemeProvider>
            </QueryClientProvider>
          </AuthProvider>
        </React.StrictMode>
      </BrowserRouter>,
      document.getElementById('root')
    );
  });
} 
else {
  const queryClient = new QueryClient();

  ReactDOM.render(
    <BrowserRouter>
      <React.StrictMode>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
              <App />
            </ThemeProvider>
          </QueryClientProvider>
        </AuthProvider>
      </React.StrictMode>
    </BrowserRouter>,
    document.getElementById('root')
  );
}

reportWebVitals();