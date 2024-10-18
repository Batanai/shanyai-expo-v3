// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './users';
import eventsReducer from './events';
import ticketsReducer from './tickets';


const store = configureStore({
  reducer: {
    user: userReducer,
    events: eventsReducer,
    tickets: ticketsReducer
  },
});

export default store;