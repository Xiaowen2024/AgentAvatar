// store.js
import { createStore } from 'redux';

// Initial state
const initialState = {
  scores: {}
};

// Reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SCORES':
      return {
        ...state,
        scores: action.payload
      };
    default:
      return state;
  }
};

// Create store
const store = createStore(reducer);

export default store;