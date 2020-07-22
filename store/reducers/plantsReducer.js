import {
  CREATE_PLANT,
  EDIT_PLANT,
  DELETE_PLANT,
  SET_PLANTS,
} from "../actions/types.js";

const userAuthReducer = (state = [], action) => {
  switch (action.type) {
    case CREATE_PLANT:
      let plant = action.payload;
      return [...state, plant];
    case SET_PLANTS:
      let plants = action.payload;
      return plants;
    case DELETE_PLANT:
      let id = action.payload;
      return state.filter((plant) => plant.id != id);
    default:
      return state;
  }
};

export default userAuthReducer;
