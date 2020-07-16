import { SET_USER, FORGET_USER, SET_SETTINGS } from "../actions/types.js";

const initialState = {
  user: null,
};

const userAuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      let settings = { ...state.settings, ...action.settings };
      return {
        ...state,
        user: action.payload,
        settings: settings,
      };
    case FORGET_USER:
      return {
        ...state,
        user: null,
      };
    case SET_SETTINGS:
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    default:
      return state;
  }
};

export default userAuthReducer;
