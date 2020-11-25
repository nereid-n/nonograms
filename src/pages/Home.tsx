import React from 'react';
import axios from "axios";

function Home() {
  getNonograms();
  function getNonograms() {
    axios.get(`${process.env.REACT_APP_API}nonograms`, {headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }})
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  }
  return (
    <div>
      home
    </div>
  );
}

export default Home;