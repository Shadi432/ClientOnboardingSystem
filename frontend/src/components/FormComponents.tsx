import { useEffect, useState } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


function onInputChanged(newValue: any, name: string, updateState: any, formState: any){
  formState.FormState[name] = newValue
  updateState(formState)
}


export function Dropdown({ name, label, options, updateState, formState, required}: any){
  if (required){
    label = label +  "*"
  }

  // This is necessary so that the dropdowns are initialised in the formState
  // console.log(formState);
  if (!(formState.hasOwnProperty(name))){
    formState.FormState[name] = options[0]
    updateState(formState);
  }

  return (
    <div className="dropdown">
      <span className="formLabel">{ label } </span>      
      <select  name={name} defaultValue={formState.FormState[name]} onChange={e => onInputChanged(e.target.value, name, updateState, formState) }>
        { options.map((option: string) => <option key={ option }>{ option } </option>) }
      </select>
    </div>
  )
}

export function InputField({name, label, updateState, formState, required}: any){
  let defaultValue = ""

  if (required){
    label = label +  "*"
  }

  if (formState.FormState){
    defaultValue = formState.FormState[name]
  }

  return (
    <div className="inputField">
      <span className="formLabel">{ label } </span>
      <input name={ name } defaultValue={ defaultValue } onChange={ e => onInputChanged(e.target.value, name, updateState, formState) }></input>
    </div>
  )
}

export function DateField({name, label, updateState, formState, required}: any){
  const [date, setDate] = useState(new Date());

  if (required){
    label = label +  "*";
  }

  // This is necessary so that when this gets pre-filled in it can initialise to the correct date.
  useEffect(()=>{
    if (formState.FormState){
      setDate(formState.FormState[name]);
    }
  }, [])


  // Initialisation is necessary because they return undefined when no date is selected. Can't validate that easily.
  if (!(formState.FormState.hasOwnProperty(name))){
    formState.FormState[name] = new Date();
  } 

  return (
    <div className="dateField">
      <span> {label} </span>
      <DatePicker showYearDropdown={true} dateFormat="dd/MM/yyyy" selected={date} onChange={(newDate: any) => { onInputChanged(newDate, name, updateState, formState); setDate(newDate);}}/>
    </div>
  )
}

export function RadioButtonSet({name, label, options, updateState, formState, required}: any){
  if (required){
    label = label +  "*";
  }

  // Initialisation means that the last element is always the default value. Works for now because last element can always be no.
  if (!(formState.FormState.hasOwnProperty(name))){
    formState.FormState[name] = options[options.length-1]
  } 

  return(
    <div>
      <span>{label}</span>
      { options.map((option: string) => {
        let defaultValue = option == formState.FormState[name]
        return(<div key={option}style={{display: "inline"}}><input defaultChecked={defaultValue} type="radio" name={name} value={option} onChange={(e) => onInputChanged(e.target.value, name, updateState, formState)}/> <span>{option}</span> </div>)
        })
      }
    </div>
  )
}