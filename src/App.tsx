import React from 'react';
import {
  Route,
  Switch,
  Redirect
} from "react-router-dom"
import './App.css';
import Auth from "./pages/auth/Auth";
import Home from "./pages/Home";
import { connect } from 'react-redux';
import {checkToken} from "./store/auth/actions";
import {authState} from "./store/auth/types";
import {stateType} from "./store";

function App(props: props) {
  props.checkToken();
  return (
    <div className="App">
      {props.auth
        ? <Switch>
          <Route path='/' component={Home} />
        </Switch>
        : <Switch>
          <Route path='/auth' component={Auth} />
          <Redirect to="/auth" />
        </Switch>
      }
    </div>
  );
}

export default connect(
  (state: stateType): authState => ({
    auth: state.auth.auth
  }),
  dispatch => ({
    checkToken: () => dispatch(checkToken())
  })
)(App);

interface props {
  auth: boolean,
  checkToken: () => void
}