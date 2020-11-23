import React, {ChangeEvent} from "react";

function Checkbox(props: props) {
  return (
    <div>
      <input
        id={props.data.id}
        name={props.data.name}
        type="checkbox"
        onChange={(e) => props.onChange(e)}/>
      <label htmlFor={props.data.id}>{props.data.label}</label>
    </div>
  );
}

export default Checkbox;

export interface dataCheckbox {
  name: string,
  id: string,
  label: string
}

interface props {
  data: dataCheckbox,
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}