import {AUTH, auth, checkTokenType, loginData} from "./types";
import axios from 'axios';

export function login(data: loginData, history: any): any {
  return (dispatch: (action: auth) => void) => {
    axios.post(`${process.env.REACT_APP_API}login`, data)
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        dispatch({
          type: AUTH.LOGIN,
        });
        history.push('/');
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

export function checkToken(): checkTokenType {
  return {
    type: AUTH.CHECK_TOKEN,
  }
}