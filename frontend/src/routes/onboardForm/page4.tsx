import { useOutletContext } from "react-router";
import { Checkbox, DateField, InputField } from "../../components/FormComponents";
import { useState } from "react";

function CreditSafeCheck(){
  const formStateHandler: { formState: {FormState: any}, updateFormState: Function} = useOutletContext();
  const formState = formStateHandler.formState;
  const updateFormState = formStateHandler.updateFormState;
  
  const previousAddressName = "CreditPreviousAddress";
  const previousAddressLabel = "Add Previous Addresses?";
  
  if (!formState.FormState[previousAddressName]){
    formState.FormState[previousAddressName] = {[previousAddressLabel]: false}
  }

  const [previousAddressFormDisplay, setPreviousAddressFormDisplay] = useState(formState.FormState[previousAddressName][previousAddressLabel]);
  
  return(
    <>
      <div style={{marginRight: "35%"}}>
        <InputField name="CreditTitle" label="Title:" updateState={updateFormState} formState={formState} required={true} />
        <InputField name="CreditFName" label="First Name:" updateState={updateFormState} formState={formState} required={true} />
        <InputField name="CreditOtherNames" label="Other Names:" updateState={updateFormState} formState={formState} />
        <InputField name="CreditLName" label="Last Name:" updateState={updateFormState} formState={formState} required={true} />
        <Checkbox name="CreditPreviousNames" labels={["Individual has previous name?"]} updateState={updateFormState} formState={formState} />
        <DateField name="CreditDOB" label="DOB:" updateState={updateFormState} formState={formState} required={true} />
      </div>

      <button id="creditSafeButton" type="button">Perform Creditsafe check</button>

      <div>
        <InputField name="CreditBuildingNo" label="Building No:" updateState={updateFormState} formState={formState} />
        <InputField name="CreditBuildingName" label="Building Name:" updateState={updateFormState} formState={formState} />
        <InputField name="CreditStreet" label="Street:" updateState={updateFormState} formState={formState} />
        <InputField name="CreditCity" label="City:" updateState={updateFormState} formState={formState} />
        <InputField name="CreditCountry" label="Country:" updateState={updateFormState} formState={formState} />
        <InputField name="CreditPostcode" label="Postcode:" updateState={updateFormState} formState={formState} required={true} />
        <DateField name="CreditStartDate" label="Start Date:" updateState={updateFormState} formState={formState} />
        <DateField name="CreditEndDate" label="End Date:" updateState={updateFormState} formState={formState} />
        
        {previousAddressLabel}
        <input type="checkbox" name={previousAddressName} defaultChecked={formState.FormState[previousAddressName][previousAddressLabel]} style={{marginLeft: "10%"}} onChange={(e)=>{
          formState.FormState[previousAddressName][previousAddressLabel] = e.target.checked
          updateFormState(formState);
          setPreviousAddressFormDisplay(formState.FormState[previousAddressName][previousAddressLabel])
        }}/>
        { previousAddressFormDisplay &&
          <div>
            <InputField name="CreditPreviousAddressLine1" label="Address Line 1:" updateState={updateFormState} formState={formState} required={true} />
            <InputField name="CreditPreviousAddressLine2" label="Address Line 2:" updateState={updateFormState} formState={formState} />
            <InputField name="CreditPreviousAddressTown" label="Town:" updateState={updateFormState} formState={formState} required={true} />
            <InputField name="CreditPreviousAddressCounty" label="County:" updateState={updateFormState} formState={formState} />
            <InputField name="CreditPreviousAddressCountry" label="Country:" updateState={updateFormState} formState={formState} required={true} />
            <InputField name="CreditPreviousAddressPostcode" label="Postcode:" updateState={updateFormState} formState={formState} required={true} /> 
          </div>
        }
      </div>
    </>
  )
}

export default CreditSafeCheck;