import { SET_USER, FORGET_USER } from "../actions/types.js";

const initialState = {
  user: null
};

const userAuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.payload
      };
    case FORGET_USER:
      return {
        ...state,
        user: null
      };
    default:
      return state;
  }
};

export default userAuthReducer;
