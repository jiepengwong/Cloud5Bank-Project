import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    access_token:"",
    id_token:"",
    roles:"",
    jwtToken : ""
}

export const everythingSlice = createSlice({
    name: "everythingSlice",
    initialState,
    reducers: {
        set_access_token: (state,action) => {
            state.access_token = action.payload;
        },
        set_id_token: (state,action) => {
            state.id_token = action.payload;
        },
        set_roles: (state,action) => {
            state.roles = action.payload;

        },
        set_JWTToken: (state,action) => {
            state.jwtToken = action.payload;

        },
    }
})

// Reducers are actions for your variable
// Take note that inside reducers : { This is an object }


// In order to use the actions, both of these statements must be written. 
// counterSlice --> is the slice created.
export const { set_access_token, set_id_token,set_roles, set_JWTToken} = everythingSlice.actions;

// Why export this?
// This is because the store will need it. It is just like that. 
export default everythingSlice.reducer
