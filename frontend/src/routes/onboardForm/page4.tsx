import { useOutletContext } from "react-router";
import { Checkbox, InputField } from "../../components/FormComponents";

function CreditSafeCheck(){
  const formStateHandler: { formState: {FormState: any}, updateFormState: Function} = useOutletContext();
  const formState = formStateHandler.formState;
  const updateFormState = formStateHandler.updateFormState;
  
  return(
    <div>
      <InputField name="CreditTitle" label="Title:" updateState={updateFormState} formState={formState} required={true} />
      <InputField name="CreditFName" label="First Name:" updateState={updateFormState} formState={formState} required={true} />
      <InputField name="CreditOtherNames" label="Other Names:" updateState={updateFormState} formState={formState} />
      <InputField name="CreditLName" label="Last Name:" updateState={updateFormState} formState={formState} required={true} />
      <Checkbox name="PreviousNames" labels={["Individual has previous name?"]} updateState={updateFormState} formState={formState} />
    </div>
  )
}

export default CreditSafeCheck;