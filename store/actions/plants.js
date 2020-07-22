import { CREATE_PLANT, EDIT_PLANT, DELETE_PLANT, GET_PLANTS } from "./types.js";
import { db, auth } from "../../config/firebase.js";

export const createPlant = (timePeriod, name = "") => async (
  dispatch,
  getState
) => {
  try {
    let plant = { timePeriod, name };
    let userId = getState().auth.user.uid;
    plant.user = userId;
    await db.collection("plants").doc().set(plant);
    dispatch({ type: CREATE_PLANT, payload: plant });
  } catch (e) {
    console.log(e);
  }
};
