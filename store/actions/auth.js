import { db, auth } from "../../config/firebase.js";
import { AsyncStorage } from "react-native";
import { SET_USER, FORGET_USER, SET_ERROR, SET_SETTINGS } from "./types.js";

export const getLocalUser = () => async (dispatch) => {
  try {
    let userData = await AsyncStorage.getItem("user");
    let user = JSON.parse(userData);
    if (user) {
      let docRef = await db.collection("settings").doc(user.uid);
      let doc = await docRef.get();
      let settings = doc.data();
      dispatch({ type: SET_USER, payload: user, settings: settings });
    }
  } catch (e) {}
};

export const handleSignIn = (email, password) => async (dispatch) => {
  try {
    let response = await auth.signInWithEmailAndPassword(email, password);
    let user = response.user;
    if (user) {
      let docRef = await db.collection("settings").doc(user.uid);
      let doc = await docRef.get();
      let settings = doc.data();
      dispatch({ type: SET_USER, payload: user, settings: settings });
      //Save user in device memory
      AsyncStorage.setItem("user", JSON.stringify(user));
    }
  } catch (e) {
    throw e;
  }
};

export const handleSignOut = () => async (dispatch) => {
  try {
    await auth.signOut();
    //remove user from device memory
    AsyncStorage.removeItem("user");
    dispatch({ type: FORGET_USER });
  } catch (e) {
    dispatch({ type: SET_ERROR, payload: e });
  }
};

export const handleSignUp = (email, password) => async (dispatch) => {
  try {
    let response = await auth.createUserWithEmailAndPassword(email, password);
    let user = response.user;
    if (user) {
      let settings = { firstLogin: true };
      db.collection("settings").doc(user.uid).set(settings);
      dispatch({ type: SET_USER, payload: user, settings: settings });
      //Save user in device memory
      AsyncStorage.setItem("user", JSON.stringify(user));
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const setWateringTime = (date) => async (dispatch, getState) => {
  try {
    let userId = getState().auth.user.uid;
    let dateString = JSON.stringify(date)
    let updatedSettings = { firstLogin: false, wateringTime: dateString };
    let doc = await db.collection("settings").doc(userId);
    await doc.update(updatedSettings);
    dispatch({ type: SET_SETTINGS, payload: updatedSettings });
  } catch (e) {
    console.log(e);
  }
};
