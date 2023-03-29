import {configureStore} from "@reduxjs/toolkit";

// Import all the slides 
import { everythingSlice } from "./features/everythingSlice";

export const store = configureStore({
    // This reducer
    reducer: {
      // Step 2: Add the imported files here.
      every: everythingSlice.reducer,


    },
  });
  