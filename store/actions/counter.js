import { INCREASE_COUNT, DECREASE_COUNT } from "./types.js";

export const increaseCount = () => {
  return { type: INCREASE_COUNT };
};

export const decreaseCount = () => {
  return { type: DECREASE_COUNT };
};
