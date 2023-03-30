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

  const [response_row, setresponse ] = useState([])

    function Load() {
      // AXIOS CALL TO GET ALL THE BANK ACCOUNTS:
      axios.get('https://zx5e5srl0m.execute-api.ap-southeast-1.amazonaws.com/test2Env/allbankaccounts', {
        headers: {
          'Authorization': jwtToken
        }
      })
      .then((response) => {
        console.log(response.data)
        // For Loop 
        const temp_result = []
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i]['user_account_id'] == ClientId) {
            temp_result.push(response.data[i])
          }
        }
        setresponse(temp_result)
        console.log(temp_result)

        alert("Load Complete")
        
      })
      .catch((error) => {
        console.log(error)
        alert("There is an Error.")

      })

    }
  

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
    const data = {
      "user_account_id": ClientId,
      "name": givenName,
      "email": email
    }
    axios.post('https://zx5e5srl0m.execute-api.ap-southeast-1.amazonaws.com/test2Env/createBankAccount',data,
    {
      headers: {
        'Authorization': jwtToken,
        'Content-Type': 'application/json', // For JSON data, use 'application/json'. For form data, use 'multipart/form-data'.
      },
    })
      .then((response) => {
        console.log(response.data)
        // For Loop 
        
      })
      .catch((error) => {
        console.log(error)
        alert("There is an Error.")
      })
    
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
      field: 'id', headerName: 'Account Number', flex: 3
    },
    { 
      field: 'accountBalance', headerName: 'Balance', flex: 3
    },
    { 
      field: 'accountType', headerName: 'Type',  flex: 3
    },
    { 
      field: 'customerID', headerName: 'User ID' , flex: 3
      // minWidth: 130, flex: 3
    },
    { 
      field: 'accountStatus', headerName: 'Status', flex: 3
    },
    { 
      field: 'Bank_account_Number', headerName: 'Bank Account Name' , flex: 3
    },
    { 
      field:"name", headerName:" Account Name ", flex: 3
    }
  ];
  
  const rows = response_row?.map(account => (
    {
      id: account.user_account_id,
      accountBalance: `$${account.balance}`,
      accountType: account.type,
      customerID: `#${ClientId}`,
      accountStatus: account.is_active,
      Bank_account_Number: account.bankaccountnumber,
      name : account.name
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
            <button onClick={Load}>
              Load Page
            </button>
          </div>

        </div>
      </div>
      
      <div style={{ height: 700, width: '90%' }}>
        <div style={{ display: 'flex', height: '100%' }}>
          <div className="table-container">
            {response_row &&
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