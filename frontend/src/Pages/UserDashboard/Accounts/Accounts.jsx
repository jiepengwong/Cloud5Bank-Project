import "./accounts.scss"
import React from 'react'
import { DataGrid } from '@mui/x-data-grid';

import apiCrud from "../../../api/apiCrud";
import popCrud from "../../../api/popCrud";
import useGetUsersAccounts from "../../../hooks/queries/users/useGetUserAccounts";
import popAction from '../../../helpers/popAction'

import { useSelector } from "react-redux";
import {useState, useEffect} from "react";
import axios from 'axios';

function Accounts() {

  const roles = useSelector(state => state.every.roles);
  const ClientId = useSelector(state => state.every.clientID);
  const address = useSelector(state => state.every.address);
  const email = useSelector(state => state.every.email);
  const family_name = useSelector(state => state.every.family_name);
  const gender = useSelector(state => state.every.gender);
  const givenName = useSelector(state => state.every.givenName);

  const idToken = useSelector(state => state.every.id_token);
  console.log(idToken)
  const jwtToken = idToken.jwtToken;
  console.log(jwtToken)

  useEffect(() => {
    // AXIOS CALL TO GET ALL THE BANK ACCOUNTS:
    axios.get('https://zx5e5srl0m.execute-api.ap-southeast-1.amazonaws.com/test2Env/alltransactions', {
      headers: {
        'Authorization': jwtToken
      }
    })
    .then((response) => {
      console.log(response.data)
    })
    .catch((error) => {
      console.log(error)
    })
  },[])

  // fetch and cache all accounts
  const {data: accounts} = {null: null}
  // console.log(accounts);

  // convert date to string
  function date(date) {
    const display = new Date(date)
    return display.toLocaleDateString('en-GB');
  }

  // set available actions

  // create a new account
  function createNewAccount() {
    popAction(
      'Are you sure?', 
      "A new account will be created!",
      'Proceed!',
      ()=>apiCrud(`/api/createAccount`, 'POST', 'Account created', {
        accountType: 'saving',
        accountBalance: '0'
      })()
    )
  } 

  // deposit
  function deposit() {
    popCrud(
      'Deposit', 
      'Deposit', 
      ['accountNumber', 'amount'], 
      `/api/recharge`,
      'POST',
      'Successful transaction'
    )
  }

  // withdraw
  function withdraw() {
    popCrud(
      'Withdraw', 
      'Withdraw', 
      ['accountNumber', 'amount'], 
      `/api/withdraw`,
      'POST',
      'Successful transaction'
    )
  }

  const columns = [
    { 
      field: 'id', headerName: 'Account Number', minWidth: 130, flex: 2
    },
    { 
      field: 'accountBalance', headerName: 'Balance', minWidth: 80, flex: 1
    },
    { 
      field: 'accountType', headerName: 'Type', minWidth: 70, flex: 1
    },
    { 
      field: 'customerID', headerName: 'User ID', minWidth: 130, flex: 3
    },
    { 
      field: 'accountStatus', headerName: 'Status', minWidth: 80, flex: 1
    },
    { 
      field: 'date', headerName: 'Date', type: 'date' , minWidth: 100, flex: 1
    },
  ];
  
  const rows = accounts?.map(account => (
    {
      id: account.accountNumber,
      accountBalance: `$${account.accountBalance}`,
      accountType: account.accountType,
      customerID: `#${account.customerID}`,
      accountStatus: account.accountStatus,
      date: date(account.createdAt),
    }
  ))

  return (
    <div className="accounts">

      <div className="title">
        <h2>Accounts belong to {givenName}</h2>

        <div className="account-actions">

          <button onClick={createNewAccount}>
            + Create new account
          </button>

          <div className="account-actions-bottom">
            <button onClick={deposit}>
              Deposit
            </button>
            <button onClick={withdraw}>
              Withdraw
            </button>
          </div>

        </div>
      </div>
      
      <div style={{ height: 700, width: '90%' }}>
        <div style={{ display: 'flex', height: '100%' }}>
          <div className="table-container">
            {accounts &&
            <DataGrid
              autoHeight
              className='table'
              rows={rows}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              disableSelectionOnClick
              sx={{
                '& .MuiDataGrid-cell:hover': {
                  cursor: 'pointer'
                },
              }}
            />
            }
          </div>
        </div>
      </div>

    </div>
  )
}

export default Accounts