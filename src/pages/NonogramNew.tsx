import React, {FormEvent, useEffect, useRef, useState} from 'react';
import Input, {dataInput} from "../components/form/Input";
import Checkbox, {dataCheckbox} from "../components/form/Checkbox";
import {ChromePicker, ColorResult} from 'react-color';
import "../style/nonogram.scss";

function NonogramNew() {
  const cellSize = 20;
  const defaultWidth = 10;
  const defaultHeight = 10;
  const defaultColor = '#000';

  const svg = useRef<SVGSVGElement>(null);

  const [prepare, setPrepare] = useState(false);
  const [prepareData, setPrepareData] = useState({width: defaultWidth, height: defaultHeight, color: false});
  const [svgSize, setSvgSize] = useState({width: defaultWidth * cellSize, height: defaultHeight * cellSize});
  const [svgData, setSvgData] = useState<svgData[]>([]);
  const [colors, setColors] = useState([defaultColor]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentColorPicker, setCurrentColorPicker] = useState(defaultColor);
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
  function openColorPicker(color: string, index: number) {
    setShowColorPicker(true);
    setCurrentColorPicker(color);
    setCurrentColorPickerIndex(index);
  }
  function changeColorPicker(color: ColorResult) {
    const newColors = [...colors];
    newColors[currentColorPickerIndex] = color.hex;
    setCurrentColorPicker(color.hex);
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
      console.log(svgClone);
    }
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
          rect.setAttribute('fill', String(row[j - max + row.length].fill));
        } else {
          rect.setAttribute('fill', '#ccc');
        }
        g.append(rect);
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

  return (
    <div>
      {!prepare ?
        <form noValidate onSubmit={(e) => createSvg(e)}>
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
                    color={currentColorPicker}
                    onChange={(color) => changeColorPicker(color)}
                  />
                </div>
              }
            </div>
          }
          <svg
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
                    style={{fill: item.fill || '#fff'}}/>
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
  fill: string | null
}

interface svgNumbers {
  count: number,
  fill: string
}