import "./accounts.scss"
import React from 'react'
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';

import useGetAccounts from '../../../hooks/queries/admin/useGetAccounts'
import popAction from "../../../helpers/popAction";
import apiCrud from "../../../api/apiCrud";

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

  const [bankAccounts, setBankAccounts] = useState([]);

  // function Load() {
    // AXIOS CALL TO GET ALL THE BANK ACCOUNTS:

  useEffect(() => {
    axios.get('https://zx5e5srl0m.execute-api.ap-southeast-1.amazonaws.com/test2Env/allbankaccounts', {
    headers: {
      'Authorization': jwtToken
    }
    })
    .then((response) => {
      console.log(response.data)
      // const inactiveAccounts = response.data.filter(account => account.is_active === false);

      setBankAccounts(response.data);
      console.log('hello')
      console.log( 'These are the bank accounts', bankAccounts)

      alert("Load Complete")
    })
    .catch((error) => {
      console.log(error)
      alert("There is an Error.")
    })
  }, []);
  // https://zx5e5srl0m.execute-api.ap-southeast-1.amazonaws.com/test2Env/bankAccountStatus/${row.Bank_account_Number
  const handleActivate = (row) => {
    axios.put(`https://zx5e5srl0m.execute-api.ap-southeast-1.amazonaws.com/test2Env/bankAccountStatus/`, {
      is_active: true,
      user_account_id: row.customerID},   {headers: {'Authorization': jwtToken}} )
    .then((response) => {
      setBankAccounts(prevState => {
        const updatedAccounts = prevState.map(account => {
          if (account.user_account_id === row.customerID) {
            account.is_active = true;
          }
          return account;
        });
        return updatedAccounts;
      });
      alert("Account activated successfully");
    })
    .catch((error) => {
      console.log(error);
      alert("Error activating account");
    });
  };


  // https://zx5e5srl0m.execute-api.ap-southeast-1.amazonaws.com/test2Env/bankAccountStatus/${row.Bank_account_Number}
  const handleDeactivate = (row) => {
    axios.put(`https://zx5e5srl0m.execute-api.ap-southeast-1.amazonaws.com/test2Env/bankAccountStatus/`, {
      is_active: false, 
      user_account_id: row.customerID},   {headers: {'Authorization': jwtToken}} )
    .then((response) => {
      setBankAccounts(prevState => {
        const updatedAccounts = prevState.map(account => {
          if (account.user_account_id === row.customerID) {
            account.is_active = false;
          }
          return account;
        });
        return updatedAccounts;
      });
      alert("Account deactivated successfully");
    })
    .catch((error) => {
      console.log(error);
      alert("Error deactivating account");
    });
  };

  const rows = bankAccounts?.map(account => (
    {
      id: account.user_account_id,
      accountBalance: account.balance,
      accountType: account.type,
      customerID: account.user_account_id,
      accountStatus: account.is_active,
      Bank_account_Number: account.bankaccountnumber,
      name : account.name
    }
  ));

  

  const columns = [
    { 
      field: 'id', headerName: 'Account Number', flex: 10
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
      field: 'accountStatus', headerName: 'Status', flex: 3, renderCell: params => (
        <span>{params.value ? 'Active' : 'Inactive'}</span>
      )
    },
    { 
      field: 'Bank_account_Number', headerName: 'Bank Account Name' , flex: 10
    },
    { 
      field:"name", headerName:" Account Name ", flex: 3
    },
    {

    field: 'activate',
    headerName: 'Activate/ Deactivate',
    flex: 5,
    renderCell: params => (
      params.row.accountStatus === false ? 
      <Button variant="contained" color="success" onClick={() => handleActivate(params.row)}>Activate</Button>
      :
      <Button variant="contained" color="error" onClick={() => handleDeactivate(params.row)}>Deactivate</Button>
    )
    }
  ];

 

  return (
    <div className="accounts">

      <div className="title">
        <h2>Accounts</h2>
      </div>
      
      <div style={{ height: 700, width: '90%' }}>
        {/* <button onClick={Load}>Page</button> */}
        <div style={{ display: 'flex', height: '100%' }}>
          <div className="table-container">
            {bankAccounts &&
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