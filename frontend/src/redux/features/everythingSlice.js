import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    access_token:"",
    id_token:"",
    roles:"",
    jwtToken : "",

    // Credentials 
    clientID: "",
    address:"",
    email:"",
    family_name:"",
    gender:"",
    givenName:""

}

export const everythingSlice = createSlice({
    name: "everythingSlice",
    initialState,
    reducers: {
        set_access_token: (state,action) => {state.access_token = action.payload;},
        set_id_token: (state,action) => {state.id_token = action.payload;},
        set_roles: (state,action) => {state.roles = action.payload;},
        set_JWTToken: (state,action) => {state.jwtToken = action.payload;},
        setClient_ID : (state,action) => {state.clientID = action.payload},
        setAddress: (state,action) => {state.address = action.payload},
        setEmail: (state,action) => {state.email = action.payload },
        setFamily_Name: (state,action) => {state.family_name = action.payload},
        setGender : (state,action) => {state.gender = action.payload},
        setGivenName : (state,action) => {state.givenName = action.payload}
    }
})

// Reducers are actions for your variable
// Take note that inside reducers : { This is an object }

export const { set_access_token, set_id_token, set_roles, set_JWTToken, setClient_ID,setAddress,setEmail,setFamily_Name,setGender,setGivenName} = everythingSlice.actions;


export default everythingSlice.reducer
