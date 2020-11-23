import {combineReducers} from "redux";
import auth from "./auth/reducers";
import {authState} from "./auth/types";

export default combineReducers({
  auth
});

export interface stateType {
  auth: authState
}