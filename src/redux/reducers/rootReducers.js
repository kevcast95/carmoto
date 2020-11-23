import { combineReducers } from "redux";

import calendar from "./calendarReducer";

const rootReducer = combineReducers({
  calendar,
});

const appReducer = (state, action) => {
  if (action.type === "RESET_APP") {
    return (state = {});
  }

  return rootReducer(state, action);
};

export default appReducer;
