import React, {FormEvent, useState} from 'react';
import { connect } from 'react-redux';
import Tabs, {tab} from "../components/tabs/Tabs";
import "../style/auth.scss";
import Input, {dataInput} from "../components/form/Input";
import Checkbox, {dataCheckbox} from "../components/form/Checkbox";
import {loginData} from "../store/auth/types";
import {login} from "../store/auth/actions";
import { useHistory } from "react-router-dom";

function Auth(props: props) {
  let history = useHistory();
  const [loginForm, setLoginForm] = useState({email: '', password: '', remember_me: false});
  const sendForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.login(loginForm, history);
  }
  return (
    <div className="auth">
      <Tabs tabs={tabs}>
        <form noValidate onSubmit={(e) => sendForm(e)}>
          <Input
            data={email}
            onChange={(e) => setLoginForm({...loginForm, [e.target.name]: e.target.value})}
          />
          <Input
            data={password}
            onChange={(e) => setLoginForm({...loginForm, [e.target.name]: e.target.value})}
          />
          <Checkbox
            data={remember_me}
            onChange={(e) => setLoginForm({...loginForm, [e.target.name]: e.target.checked})}
          />
          <button>Войти</button>
        </form>
        <div>Регистрация</div>
      </Tabs>
    </div>
  );
}

export default connect(
  null,
  dispatch => ({
    login: (data: loginData, history: any) => dispatch(login(data, history))
  })
)(Auth);

const tabs: tab[] = [
  {
    name: 'Вход'
  },
  {
    name: 'Регистрация'
  }
];

const email: dataInput = {
  name: 'email',
  type: 'email',
  id: 'email',
  label: 'Email'
}
const password: dataInput = {
  name: 'password',
  type: 'password',
  id: 'password',
  label: 'Password'
}

const remember_me: dataCheckbox = {
  name: 'remember_me',
  id: 'remember_me',
  label: 'Запомнить'
}

interface props {
  login: (data: loginData, history: any) => void;
}
