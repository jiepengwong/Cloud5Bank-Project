import "./transfer.scss"
import React from 'react'
import {useFormik} from 'formik'

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { transferSchema } from "../../../schemas/transferSchema";
import popAction from "../../../helpers/popAction";
import apiCrud from "../../../api/apiCrud";
import { TextField } from "@mui/material";
import Button from '@mui/material/Button';

import {useState, useEffect} from "react";
import { useSelector } from "react-redux";
import axios from "axios";

function Transfer() {

  const [accountFrom, setAccountFrom] = useState("");
  const [tempamount, set_tempamount] = useState("");
  const [accountTo, setAccountTo] = useState("");

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

  const Transfer = () => {
    // Axios 

    const data = {
    "amount": parseInt(tempamount),
    "fromAccountUserid": accountFrom,
    "toAccountUserid": accountTo
  }

    axios.post('https://zx5e5srl0m.execute-api.ap-southeast-1.amazonaws.com/test2Env/transferfunds',data,
    {
      headers: {
        'Authorization': jwtToken,
        // 'Content-Type': 'application/json', // For JSON data, use 'application/json'. For form data, use 'multipart/form-data'.
      },
    })
      .then((response) => {
        console.log(response.data)
        alert("Success!")
        
      })
      .catch((error) => {
        console.log(error)
        alert("There is an Error.")
      })

  
  }

  const transferForm =(
		<main className='transfer-form'>
      <form>

        <div className="input-holder">
          <label>Account Number<span style={{color: 'red'}}> (From)</span></label><br/>
          <TextField onChange={event => {setAccountFrom(event.target.value)}}></TextField>
        </div>

        <div className="input-holder">
          <label>Amount</label><br/>
          <TextField onChange={event => {set_tempamount(event.target.value)}} ></TextField>
        </div>
        <div className="input-holder">
          <label>Account Number<span style={{color: 'green'}}> (Recipient)</span></label><br/>
          <TextField onChange={event => {setAccountTo(event.target.value)}} ></TextField>
        </div>
        <Button onClick={() => Transfer()}>Transfer</Button>

      </form>
		</main>
	)

  return (
    <div className="transfer">

      <div className="title">
        <h2>Money Transfer</h2>
      </div>

      {transferForm}

    </div>
  )
}

export default Transfer