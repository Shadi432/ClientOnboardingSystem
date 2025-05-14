
function onInputChanged(e: any, name: string, updateState: any, formState: any){
  formState[name].value = e.target.value
  updateState(formState)
}


export function Dropdown({ name, options, label, updateState, formState, required}: any){
  formState[name] = {
    required: required ? true : false,
    value: options[0]
  }

  if (required){
    label = label +  "*"
  }
  return (
    <div className="dropdown">
      <span className="formLabel">{ label } </span>
      <select  name={name} onChange={e => onInputChanged(e, name, updateState, formState) }>
        { options.map((option: string) => <option key={ option } value={ option }>{ option } </option>) }
      </select>
    </div>
  )
}

export function InputField({name, label, updateState, formState, required}: any){
  formState[name] = {
    required: required ? true : false,
    value: ""
  }

  return (
    <div className="inputField">
      <span className="formLabel">{ label } </span>
      <input name={ name } onChange={ e => onInputChanged(e, name, updateState, formState) }></input>
    </div>
  )
}