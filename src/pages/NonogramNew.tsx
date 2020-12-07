import React, {FormEvent, useEffect, useRef, useState} from 'react';
import Input, {dataInput} from "../components/form/Input";
import Checkbox, {dataCheckbox} from "../components/form/Checkbox";
import {ChromePicker, ColorResult} from 'react-color';
import "../style/nonogram.scss";
import axios from "axios";

function NonogramNew() {
  const cellSize = 20;
  const defaultWidth = 10;
  const defaultHeight = 10;
  const defaultColor = {
    hex: '#000',
      rgb: {
        r: 0,
        g: 0,
        b: 0,
        a: 1,
      },
      hsl: {
        h: 150,
        s: 0,
        l: 0,
        a: 1,
      },
  };

  const svg = useRef<SVGSVGElement>(null);

  const [prepare, setPrepare] = useState(false);
  const [prepareData, setPrepareData] = useState<any>({width: defaultWidth, height: defaultHeight, color: false, name: 'Без имени'});
  const [svgSize, setSvgSize] = useState({width: defaultWidth * cellSize, height: defaultHeight * cellSize});
  const [svgData, setSvgData] = useState<svgData[]>([]);
  const [colors, setColors] = useState<ColorResult[]>([defaultColor]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentColorPicker, setCurrentColorPicker] = useState<ColorResult>(defaultColor);
  const [currentColorPickerIndex, setCurrentColorPickerIndex] = useState(0);
  const [currentColor, setCurrentColor] = useState(0);
  const [cells, setCells] = useState<NodeListOf<SVGRectElement>>();

  useEffect(() => {
    if (prepare && svg && svg.current) {
      const svgWidth = prepareData.width * cellSize;
      const svgHeight = prepareData.height * cellSize;
      setSvgSize({width: svgWidth, height: svgHeight});
      for (let i = 0; i < svgHeight; i += cellSize) {
        for (let j = 0; j < svgWidth; j += cellSize) {
          setSvgData(prev => [...prev, {
            width: cellSize,
            height: cellSize,
            x: j,
            y: i,
            fill: null
          }]);
        }
      }
    }
  }, [prepare, prepareData]);
  useEffect(() => {
    setCells(document.querySelectorAll('#svgImg rect'));
  }, [svgData]);

  function createSvg(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPrepare(true);
  }
  function openColorPicker(color: ColorResult, index: number) {
    setShowColorPicker(true);
    setCurrentColorPicker(color);
    setCurrentColorPickerIndex(index);
  }
  function changeColorPicker(color: ColorResult) {
    const newColors = [...colors];
    newColors[currentColorPickerIndex] = color;
    setCurrentColorPicker(color);
    setColors(newColors);
  }
  function deleteColor(index: number) {
    const newColors = [...colors];
    newColors.splice(index, 1);
    setColors(newColors);
  }
  function draw(e: React.MouseEvent<SVGRectElement, MouseEvent>) {
    let target = e.target as SVGRectElement;
    let index = getCellIndex(target);
    let clear = svgData[index].fill !== null;
    changeCellColor(target, clear);
    const mousemove = (e: MouseEvent) => {
      const parent = target.closest('#svgImg');
      if (target.tagName === 'rect' && parent !== null) {
        if (e.target !== target) {
          target = e.target as SVGRectElement;
          changeCellColor(target, clear);
        }
      }
    }
    document.addEventListener('mousemove', mousemove);
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', mousemove);
    })
  }
  function getCellIndex(target: SVGRectElement): number {
    let index = 0;
    if (cells) {
      for (let i = 0; i < cells.length; i++) {
        if (target === cells[i]) {
          index = i;
          break;
        }
      }
    }
    return index;
  }
  function changeCellColor(target: SVGRectElement, clear: boolean) {
    let newSvgData = [...svgData];
    let index = getCellIndex(target);
    if (clear) {
      newSvgData[index].fill = null;
    } else {
      newSvgData[index].fill = colors[currentColor];
    }
    setSvgData(newSvgData);
  }
  function save() {
    if (svg && svg.current) {
      const svgClone = svg.current.cloneNode(true) as SVGSVGElement;
      const svgImg = svgClone.firstChild as SVGGElement;
      let leftNumber: svgNumbers[][] = [[]];
      let topNumber: svgNumbers[][] = [[]];
      fillNumbers(leftNumber);
      fillNumbers(topNumber, 'column');
      const maxLeft = findMaxNumbers(leftNumber);
      const leftNumberSvg = createNumbers(leftNumber, maxLeft);
      svgClone.appendChild(leftNumberSvg);
      const maxTop = findMaxNumbers(topNumber);
      const topNumberSvg = createNumbers(topNumber, maxTop, 'top');
      svgClone.appendChild(topNumberSvg);
      const spacingTop = maxTop * cellSize;
      const spacingLeft = maxLeft * cellSize;
      svgImg.setAttribute('transform', `translate(${spacingLeft} ${spacingTop})`);
      leftNumberSvg.setAttribute('transform', `translate(0 ${spacingTop})`);
      topNumberSvg.setAttribute('transform', `translate(${spacingLeft})`);
      svgClone.setAttribute('width', String(svgSize.width + spacingLeft));
      svgClone.setAttribute('height', String(svgSize.height + spacingTop));
      addLines(svgClone, spacingLeft, spacingTop);
      send(svgClone);
    }
  }
  function addLines(svg: SVGSVGElement, left: number, top: number) {
    const fiveCells = 5 * cellSize;
    for (let i = left + fiveCells; i < svgSize.width; i += fiveCells) {
      createLine(i, i, 0, svgSize.height + top, svg);
    }
    for (let i = top + fiveCells; i < svgSize.height; i += fiveCells) {
      createLine(0, svgSize.width + left, i, i, svg);
    }
  }
  function createLine(x1: number, x2: number, y1: number, y2: number, svg: SVGSVGElement) {
    const line = document.createElement('line');
    line.setAttribute('x1', String(x1));
    line.setAttribute('x2', String(x2));
    line.setAttribute('y1', String(y1));
    line.setAttribute('y2', String(y2));
    line.setAttribute('stroke', '#000');
    svg.append(line);
  }
  function fillNumbers(numbers: svgNumbers[][], direction?: string) {
    let row = 0;
    let fill = null;
    let countFill = 0;
    let iMax = prepareData.height;
    let jMax = prepareData.width;
    if (direction === 'column') {
      iMax = prepareData.width;
      jMax = prepareData.height;
    }
    for (let i = 0; i < iMax; i++) {
      for (let j = 0; j < jMax; j++) {
        let cellIndex;
        if (direction === 'column') {
          cellIndex = i + j * prepareData.width;
        } else {
          cellIndex = j + i * prepareData.width;
        }
        const currentFill = svgData[cellIndex].fill;
        if (i !== row) {
          row = i;
          countFill = 0;
          fill = null;
          numbers.push([]);
        }
        if (currentFill !== fill) {
          if (countFill > 0 && fill !== null) {
            numbers[i].push({
              count: countFill,
              fill: fill
            });
          }
          countFill = 0;
          fill = currentFill;
        }
        if (fill !== null) {
          countFill++;
        }
      }
    }
  }
  function createNumbers(numbers: svgNumbers[][], max: number, place = 'left'): HTMLElement {
    const g = document.createElement('g');
    g.className = 'svgNumbers';
    for (let i = 0; i < numbers.length; i++) {
      const row = numbers[i];
      for (let j = 0; j < max; j++) {
        let x;
        let y;
        if (place === 'left') {
          x = j * cellSize;
          y = i * cellSize;
        } else {
          x = i * cellSize;
          y = j * cellSize;
        }
        const rect = document.createElement('rect');
        rect.setAttribute('width', String(cellSize));
        rect.setAttribute('height', String(cellSize));
        rect.setAttribute('x', String(x));
        rect.setAttribute('y', String(y));
        if (j >= max - row.length) {
          const gRect = document.createElement('g');
          const numberCell = row[j - max + row.length];
          rect.setAttribute('fill', numberCell.fill.hex);
          const text = document.createElement('text');
          text.setAttribute('x', String(x));
          text.setAttribute('y', String(y));
          text.innerText = String(numberCell.count);
          if (numberCell.fill.hsl.l < 0.5) {
            text.className = 'fill-white';
          }
          gRect.append(rect);
          gRect.append(text);
          g.append(gRect);
        } else {
          rect.setAttribute('fill', '#ccc');
          g.append(rect);
        }
      }
    }
    return g;
  }
  function findMaxNumbers(arr: svgNumbers[][]): number {
    let max = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].length > max) {
        max = arr[i].length;
      }
    }
    return max;
  }
  function send(svg: SVGSVGElement) {
    let newData = {...prepareData};
    newData.color = newData.color ? 1 : 0;
    let formData: FormData = new FormData();
    for (let key in newData) {
      formData.append(key, String(newData[key]));
    }
    formData.append('img', new Blob([svg.outerHTML], {type:"image/svg+xml;charset=utf-8"}));
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        'Content-Type': 'multipart/form-data'
      }
    };
    axios.post(`${process.env.REACT_APP_API}nonograms/add`, formData, config)
      .then(res => {
        console.log(res)
        // history.push('/');
      })
      .catch(err => {
        console.log(err);
      });
  }

  return (
    <div>
      {!prepare ?
        <form noValidate onSubmit={(e) => createSvg(e)}>
          <Input
            data={name}
            onChange={(e) => setPrepareData({...prepareData, [e.target.name]: e.target.value})}/>
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
        </form> :
        <div>
          {prepareData.color &&
            <div>
              {
                colors.map((color, i) => (
                  <div
                    style={{backgroundColor: color}}
                    className="color"
                    key={`color${i}`}
                    onClick={() => setCurrentColor(i)}
                  >
                    <button onClick={() => deleteColor(i)}>Удалить</button>
                    <button onClick={() => openColorPicker(color, i)}>Изменить</button>
                  </div>
                ))
              }
              <button onClick={() => setColors([...colors, defaultColor])}>Добавить цвет</button>
              {showColorPicker &&
                <div className="color-popover">
                  <div onClick={() => setShowColorPicker(false)} className="color-cover"/>
                  <ChromePicker
                    color={currentColorPicker.hex}
                    onChange={(color) => changeColorPicker(color)}
                  />
                </div>
              }
            </div>
          }
          <svg
            crossOrigin="anonymous"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            className="svgNonogram"
            width={svgSize.width}
            height={svgSize.height}
            ref={svg}>
            <g id="svgImg">
              {
                svgData.map((item, i) => (
                  <rect
                    onMouseDown={(e) => draw(e)}
                    key={`rectImg${i}`}
                    x={item.x}
                    y={item.y}
                    height={item.height}
                    width={item.width}
                    style={{fill: item.fill?.hex || '#fff'}}/>
                ))
              }
            </g>
          </svg>
          <button onClick={() => save()}>
            Готово
          </button>
        </div>
      }
    </div>
  );
}

export default NonogramNew;

const name: dataInput = {
  name: 'name',
  type: 'text',
  label: 'Название',
  id: 'name'
}

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

interface svgData {
  width: number,
  height: number,
  x: number,
  y: number,
  fill: ColorResult | null
}

interface svgNumbers {
  count: number,
  fill: ColorResult
}