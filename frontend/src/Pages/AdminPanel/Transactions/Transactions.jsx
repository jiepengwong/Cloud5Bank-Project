import "./transactions.scss"
import { DataGrid } from '@mui/x-data-grid';
import { useSelector } from "react-redux";
import {useState, useEffect} from "react";
import axios from 'axios';

import useGetTransactions from "../../../hooks/queries/admin/useGetTransactions";

//https://zx5e5srl0m.execute-api.ap-southeast-1.amazonaws.com/test2Env/alltransactions


function Transactions() {

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
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios.get('https://zx5e5srl0m.execute-api.ap-southeast-1.amazonaws.com/test2Env/alltransactions', {
    headers: {
      'Authorization': jwtToken
    }
  })
  .then((response) => {
    console.log(response.data)
    // const inactiveAccounts = response.data.filter(account => account.is_active === false);

    setTransactions(response.data);
    console.log('hello')
    console.log( 'This is the Transactions', transactions)

    alert("Load Complete")
  })
  .catch((error) => {
    console.log(error)
    alert("There is an Error.")

  })
}, []);

  // // fetch and cache all transactions
  // const {data: transactions} = useGetTransactions()
  // // console.log(transactions)

  //   // convert date to string
  //   function date(date) {
  //     const display = new Date(date)
  //     return display.toLocaleDateString('en-GB');
  //   }

    const columns = [
      { 
        field: 'dateTransaction', headerName: 'Date', type: 'date' , minWidth: 100, flex: 1
      },
      { 
        field: 'fromAccountBankNumber', headerName: 'From BA', minWidth: 130, flex: 1
      },
      { 
        field: 'fromAccountUserId', headerName: 'From ID', minWidth: 70, flex: 1
      },
      { 
        field: 'toAccountBankNumber', headerName: 'To BA', minWidth: 70, flex: 1
      },
      { 
        field: 'toAccountUserId', headerName: 'To ID', minWidth: 130, flex: 2
      },
      { 
        field: 'transaction_id', headerName: 'Transaction ID', minWidth: 150, flex: 2.2
      },
      { 
        field: 'transactiontype', headerName: 'Transaction Type', minWidth: 150, flex: 2.2
      },
      { 
        field: 'amount', headerName: 'Amount', minWidth: 150, flex: 2.2
      },
    ];
    
    const rows = transactions?.map(transaction => (
      {
        dateTransaction: transaction.dataTransaction,
        fromAccountBankNumber: transaction.fromAccountBankNumber,
        fromAccountUserId: transaction.fromAccountUserId,
        toAccountBankNumber: transaction.toAccountBankNumber,
        toAccountUserId: transaction.toAccountUserId,
        transaction_id: transaction.transaction_id,
        transactiontype: transaction.transactiontype,
        amount: transaction.amount
      }
    ))

  return (
    <div className="transactions">

      <div className="title">
        <h2>Transactions</h2>
      </div>

      <div style={{ height: 700, width: '90%' }}>
        <div style={{ display: 'flex', height: '100%' }}>
          <div className="table-container">
            {transactions &&
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
              getRowId={(rows) => rows.transaction_id}
            />
            }
          </div>
        </div>
      </div>

    </div>
  )
}

export default Transactions