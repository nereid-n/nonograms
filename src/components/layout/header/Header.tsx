import React from 'react';
import {Link} from "react-router-dom";
import "./header.scss";

function Header() {
  return (
    <div>
      <Link to="/nonograms/new">Добавить кроссворд</Link>
    </div>
  );
}

export default Header;