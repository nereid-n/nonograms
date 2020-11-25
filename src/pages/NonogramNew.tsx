import React, {FormEvent, useEffect, useRef, useState} from 'react';
import Input, {dataInput} from "../components/form/Input";
import Checkbox, {dataCheckbox} from "../components/form/Checkbox";

function NonogramNew() {
  const cellSize = 20;
  const defaultWidth = 10;
  const defaultHeight = 10;
  const [prepare, setPrepare] = useState(false);
  const [prepareData, setPrepareData] = useState({width: defaultWidth, height: defaultHeight, color: false});
  const [canvasSize, setCanvasSize] = useState({width: defaultWidth * cellSize, height: defaultHeight * cellSize});
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (prepare && canvas && canvas.current) {
      const ctx = canvas.current.getContext('2d');
      const canvasWidth = prepareData.width * cellSize;
      const canvasHeight = prepareData.height * cellSize;
      setCanvasSize({width: canvasWidth, height: canvasHeight});
      if (ctx !== null) {
        for (let i = 0; i < canvasWidth; i += cellSize) {
          for (let j = 0; j < canvasHeight; j += cellSize) {
            ctx.fillStyle = "#ffffff";
            ctx.strokeStyle = "#cccccc";
            ctx.fillRect(i,j,cellSize,cellSize);
            ctx.strokeRect(i,j,cellSize,cellSize);
          }
        }
      }
    }
  }, [prepare, prepareData]);
  function createCanvas(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPrepare(true)
  }
  return (
    <div>
      <form noValidate onSubmit={(e) => createCanvas(e)}>
        <Input
          data={width}
          onChange={(e) => setPrepareData({...prepareData, [e.target.name]: e.target.value})}/>
        <Input
          data={height}
          onChange={(e) => setPrepareData({...prepareData, [e.target.name]: e.target.value})}/>
        <Checkbox
          data={color}
          onChange={(e) => setPrepareData({...prepareData, [e.target.name]: e.target.checked})}
        />
        <button>Создать</button>
      </form>
      <div>
        <canvas width={canvasSize.width} height={canvasSize.height} ref={canvas}/>
      </div>
    </div>
  );
}

export default NonogramNew;

const width: dataInput = {
  name: 'width',
  type: 'number',
  label: 'Ширина',
  id: 'width'
}

const height: dataInput = {
  name: 'height',
  type: 'number',
  label: 'Высота',
  id: 'height'
}

const color: dataCheckbox = {
  name: 'color',
  id: 'color',
  label: 'Цветной кроссворд'
}