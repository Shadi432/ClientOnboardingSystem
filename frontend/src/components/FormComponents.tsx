
function onInputChanged(e: any, name: string, updateState: any, formState: any){
  formState.FormState[name] = e.target.value
  updateState(formState)
}


export function Dropdown({ name, options, label, updateState, formState, required}: any){
  if (required){
    label = label +  "*"
  }

  // This is necessary so that the dropdowns are initialised in the formState
  if (!(formState.hasOwnProperty(name))){
    formState.FormState[name] = options[0]
    updateState(formState);
  }

  return (
    <div className="dropdown">
      <span className="formLabel">{ label } </span>      
      <select  name={name} defaultValue={formState.FormState[name]} onChange={e => onInputChanged(e, name, updateState, formState) }>
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
      <input name={ name } defaultValue={ defaultValue } onChange={ e => onInputChanged(e, name, updateState, formState) }></input>
    </div>
  )
}