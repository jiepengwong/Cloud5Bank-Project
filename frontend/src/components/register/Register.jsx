import './register.scss'
import axios from 'axios'
import React from "react";
import {useFormik} from 'formik'

import { registerSchema } from '../../schemas/registerSchema';
import popAlert from "../../helpers/popAlert";

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Register(){

	window.location.href = 'https://smu-cloud5bank.auth.ap-southeast-1.amazoncognito.com/login?client_id=s3qtr2qr1m73t6keq2b9t3sk4&response_type=code&scope=aws.cognito.signin.user.admin+email+openid+phone&redirect_uri=https://master.d2czb7pbc1jvrq.amplifyapp.com/';

}