import React from 'react';
import Tabs, {tab} from "../../components/tabs/Tabs";
import "./auth.scss";

const tabs: tab[] = [
  {
    name: 'Вход'
  },
  {
    name: 'Регистрация'
  }
];

function Auth() {
  return (
    <div className="auth">
      <Tabs tabs={tabs}>
        <div>Вход</div>
        <div>Регистрация</div>
      </Tabs>
    </div>
  );
}

export default Auth;