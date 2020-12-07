import React, {useEffect, useState} from 'react';
import axios from "axios";

function Home() {
  const [nonograms, setNonograms] = useState<nonogram[]>([]);
  const [images, setImages] = useState<any>([]);
  useEffect(() => {
    if (nonograms.length === 0) {
      getNonograms();
    }
  }, [nonograms])
  function getNonograms() {
    axios.get(`${process.env.REACT_APP_API}nonograms`, {headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }})
      .then(res => {
        setNonograms(res.data.items);
      })
      .catch(err => {
        console.log(err);
      });
  }
  function XMLToSVG(path: string) {
    axios.get(path)
      .then(res => {
        const newImages = [...images];
        newImages.push(res.data);
        setImages(newImages);
      })
  }
  return (
    <div>
      {
        nonograms.map((item, index) => (
          <div
            key={`nonogram${item.id}`}
          >
            {/*{XMLToSVG(process.env.REACT_APP_URI + item.img)}*/}
            <object type="image/svg+xml" data={process.env.REACT_APP_URI + item.img} width="200" height="200" >
              Your browser does not support SVG
            </object>
            <div>
              <div>{item.name}</div>
            </div>
          </div>
        ))
      }
    </div>
  );
}

export default Home;

interface nonogram {
  color: number
  created_at: string
  height: number
  id: number
  img: string
  name: string
  updated_at: string
  user_id: number
  width: number
}