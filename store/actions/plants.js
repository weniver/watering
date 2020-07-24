import { CREATE_PLANT, EDIT_PLANT, DELETE_PLANT, SET_PLANTS } from "./types.js";
import { db, auth } from "../../config/firebase.js";
import moment from "moment";
import _ from "lodash"

export const createPlant = (timePeriod, name = "") => async (
  dispatch,
  getState
) => {
  try {
    let userId = getState().auth.user.uid;
    let birthday = new Date();
    let plant = {
      timePeriod,
      name,
      birthday,
      user: userId,
      active: true,
      wateringHistory: [birthday],
    };
    let doc = await db.collection("plants").doc();
    await doc.set(plant);
    plant.id = doc.id;
    dispatch({ type: CREATE_PLANT, payload: plant });
  } catch (e) {
    console.log(e);
  }
};

export const getPlants = () => async (dispatch, getState) => {
  try {
    let plantsRef = await db.collection("plants");
    let userId = getState().auth.user.uid;

    let queryUserPlants = await plantsRef
      .where("user", "==", `${userId}`)
      .where("active", "==", true)
      .get();

    let plants = [];

    queryUserPlants.forEach((doc) => {
      let plantData = doc.data();
      plantData.id = doc.id;
      plants = [...plants, plantData];
    });

    dispatch({ type: SET_PLANTS, payload: plants });
  } catch (e) {
    console.log(e);
  }
};

export const deactivatePlant = (plantId) => async (dispatch) => {
  try {
    let plantsRef = await db.collection("plants").doc(plantId);
    await plantsRef.update({ active: false });
    dispatch({ type: DELETE_PLANT, payload: plantId });
  } catch (e) {
    console.log(e);
  }
};

export const addWateringTime = (lastDate) => async (dispatch) => {
  try {
    let plantsRef = await db.collection("plants").doc(plantId);
    await plantsRef.update({ active: false });
    dispatch({ type: DELETE_PLANT, payload: plantId });
  } catch (e) {
    console.log(e);
  }
};
