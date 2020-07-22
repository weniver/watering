import { combineReducers } from "redux";
import authReducer from "./authReducer.js";
import plantsReducer from "./plantsReducer.js";

export default combineReducers({ auth: authReducer, plants: plantsReducer });
