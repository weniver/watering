import { combineReducers } from "redux";
import counterReducer from "./counterReducer.js";
import authReducer from "./authReducer.js";

export default combineReducers({ counter: counterReducer, auth: authReducer });
