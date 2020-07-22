import { CREATE_PLANT, EDIT_PLANT, DELETE_PLANT, GET_PLANTS } from "../actions/types.js";

const userAuthReducer = (state = [], action) => {
  switch (action.type) {
    case CREATE_PLANT:
      let plant = action.payload;
      return [...state, plant];
    case EDIT_PLANT:
      return {
        ...state,
        user: null,
      };
    case DELETE_PLANT:
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    default:
      return state;
  }
};

export default userAuthReducer;
