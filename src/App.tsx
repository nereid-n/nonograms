import React from 'react';
import {
  Route,
  Switch,
  Redirect
} from "react-router-dom"
import './App.css';
import Auth from "./pages/auth/Auth";
import Home from "./pages/Home";

const auth = false;

function App() {
  return (
    <div className="App">
      {auth
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

export default App;
