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
import Amplify from './aws-exports';
// Configure AWS SDK
import AWS from 'aws-sdk';
import awsconfig from './aws-exports';
import { CognitoUserPool } from 'amazon-cognito-identity-js';


// Configure AWS Amplify
// Amplify.configure(awsconfig);

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

    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'your_identity_pool_id',
      Logins: {
        [`cognito-idp.${AWS.config.region}.amazonaws.com/${'your_user_pool_id'}`]: session.getIdToken().getJwtToken(),
      },
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