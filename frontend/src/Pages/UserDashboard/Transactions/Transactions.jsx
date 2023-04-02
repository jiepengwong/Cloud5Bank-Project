import "./transactions.scss"
import { DataGrid } from '@mui/x-data-grid';

import useApi from "../../../hooks/useApi";

import { useSelector } from "react-redux";
import {useState, useEffect} from "react";
import axios from "axios";

function Transactions() {
  const roles = useSelector(state => state.every.roles);
  const ClientId = useSelector(state => state.every.clientID);
  const address = useSelector(state => state.every.address);
  const email = useSelector(state => state.every.email);
  const family_name = useSelector(state => state.every.family_name);
  const gender = useSelector(state => state.every.gender);
  const givenName = useSelector(state => state.every.givenName);

  const idToken = useSelector(state => state.every.id_token);
  // console.log(idToken)
  const jwtToken = idToken.jwtToken;
  console.log(jwtToken)

  console.log("This is the client ID "+ ClientId)



  // fetch and cache all transactions
  const {data: transactions} = {"":""}
  // console.log(transactions)


  const [responserow , set_responserow] = useState()
  // Load Page with Transaction 
  function loadPage() {
    axios.get('https://zx5e5srl0m.execute-api.ap-southeast-1.amazonaws.com/test2Env/alltransactions', {
      headers: {
        'Authorization': jwtToken
      }
    })
    .then((response) => {
      console.log(response.data)
      // For Loop 
      const temp_result = []
      for (let i = 0; i < response.data.length; i++) {
        console.log(response.data[i])
        if (response.data[i]['fromAccountUserId'] == ClientId || response.data[i]['toAccountUserId'] == ClientId) {
          temp_result.push(response.data[i])
        }
      }
      set_responserow(temp_result)
      console.log("This is temp result:")
      console.log(temp_result)

      alert("Load Complete")
      
    })
    .catch((error) => {
      console.log(error)
      alert("There is an Error.")

    })
  }
    // convert date to string
    function date(date) {
      const display = new Date(date)
      return display.toLocaleDateString('en-GB');
    }

    const columns = [
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
    
    const rows = responserow?.map(transaction => (
      {
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

      <div className="accounts">
        <div className="title">
          <h2>Transactions with Client ID: {ClientId}</h2>
        </div>
        <div className = "account-actions-bottom">
          <button onClick={() => loadPage()}>
            Load Page
          </button>
        </div>

      </div>


      <div style={{ height: 700, width: '90%' }}>
        <div style={{ display: 'flex', height: '100%' }}>
          <div className="table-container">
            {responserow &&
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