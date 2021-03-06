import React, {ChangeEvent} from "react";

function Input(props: props) {
  return (
    <div>
      <label htmlFor={props.data.id}>{props.data.label}</label>
      <input
        id={props.data.id}
        name={props.data.name}
        type={props.data.type}
        onChange={(e) => props.onChange(e)}/>
    </div>
  );
}

export default Input;

export interface dataInput {
  name: string,
  type: string,
  id: string,
  label: string
}

interface props {
  data: dataInput,
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}