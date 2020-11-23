import {AUTH, authState, AuthType} from "./types";

const initialState: authState = {
  auth: false
}

export default function auth (state = initialState, action: AuthType) {
  switch (action.type) {
    case AUTH.LOGIN:
      return {...state, auth: true};
    case AUTH.CHECK_TOKEN:
      return {...state, auth: localStorage.getItem("token") !== null};
    default:
      return state;
  }
}