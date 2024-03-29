import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from 'react-router-dom'
import {QueryClientProvider, QueryClient} from 'react-query'
import { AuthProvider } from './context/Auth-context';
import { ThemeProvider } from '@mui/material';
import { theme } from './theme';

import {Provider} from "react-redux";
import {store} from "./redux/store";
const queryClient = new QueryClient()

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <React.StrictMode>
      <Provider store = {store}>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
              <App />
            </ThemeProvider>
        </QueryClientProvider>
      </Provider>
    </React.StrictMode>
  </BrowserRouter>
);

reportWebVitals();