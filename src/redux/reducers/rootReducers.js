import { combineReducers } from "redux";

import carmoto from "./carmotoReducer";

const rootReducer = combineReducers({
  carmoto,
});

const appReducer = (state, action) => {
  if (action.type === "RESET_APP") {
    return (state = {});
  }

  return rootReducer(state, action);
};

export default appReducer;
