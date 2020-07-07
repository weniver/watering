import { db, auth } from "../../config/firebase.js";
import { AsyncStorage } from "react-native";
import { SET_USER, FORGET_USER, SET_ERROR } from "./types.js";

export const getLocalUser = () => async dispatch => {
  try {
    let userData = await AsyncStorage.getItem("user");
    let user = JSON.parse(userData);
    if (user) {
      dispatch({ type: SET_USER, payload: user });
    }
  } catch (e) {
    console.log(e);
  }
};

export const handleSignIn = (email, password) => async dispatch => {
  try {
    let response = await auth.signInWithEmailAndPassword(email, password);
    let user = response.user;
    if (user) {
      dispatch({ type: SET_USER, payload: user });
      //Save user in device memory
      AsyncStorage.setItem("user", JSON.stringify(user));
    }
  } catch (e) {
    throw e
  }
};

export const handleSignOut = () => async dispatch => {
  try {
    await auth.signOut();
    //remove user from device memory
   AsyncStorage.removeItem("user");
    dispatch({ type: FORGET_USER });
  } catch (e) {
    dispatch({ type: SET_ERROR, payload: e });
  }
};

export const handleSignUp = (email, password) => async dispatch => {
  try {
    let response = await auth.createUserWithEmailAndPassword(email, password);
    let user = response.user;

    if (user) {
      dispatch({ type: SET_USER, payload: user });
      //Save user in device memory
      AsyncStorage.setItem("user", JSON.stringify(user));
    }
  } catch (e) {
    throw e
  }
};
