import { useOutletContext } from "react-router";
import { Checkbox, DateField, InputField } from "../../components/FormComponents";
import { CSSProperties, useEffect, useState } from "react";
import axios from "axios";

// setsIsLoading to true, performs request, setsIsLoading to false.
async function performCreditCheck(setIsLoading: any, setCreditCheckSuccess: any, extraData?: any){
  setIsLoading(true);
  await axios.post(" http://localhost:3000", {"Name": "MahdiBFof", "ExtraInfo": extraData && extraData.name}).then((response) => setCreditCheckSuccess(response.data)).catch((err) => console.log(err))
  .finally(() => setIsLoading(false));
}

function CreditSafeCheck(){
  const formStateHandler: { formState: {FormState: any}, updateFormState: Function, setCanProceed: any} = useOutletContext();
  const formState = formStateHandler.formState;
  const updateFormState = formStateHandler.updateFormState;
  const setCanProceed = formStateHandler.setCanProceed;
  
  const previousAddressName = "CreditPreviousAddress";
  const previousAddressLabel = "Add Previous Addresses?";
  
  if (!formState.FormState[previousAddressName]){
    formState.FormState[previousAddressName] = {[previousAddressLabel]: false}
  }

  const [previousAddressFormDisplay, setPreviousAddressFormDisplay] = useState(formState.FormState[previousAddressName][previousAddressLabel]);
  const [isLoading, setIsLoading] = useState(false);
  const [creditCheckSuccess, setCreditCheckSuccess] = useState(false);
  const [creditCheckStarted, setCreditCheckStarted] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const onFileChange = (event: any) => {
    setSelectedFile(event.target.files[0])
  }

  useEffect(() => {
    setCanProceed({canProceed: creditCheckSuccess})
  }, [creditCheckSuccess])
  
  if (!creditCheckStarted){
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

        <button id="creditSafeButton" type="button" onClick={() => {setCreditCheckStarted(true); performCreditCheck(setIsLoading, setCreditCheckSuccess)}}>Perform Creditsafe check</button>

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
  } else if (isLoading) {
    const override: CSSProperties = {
      display: "block",
      margin: "0 auto",
      borderColor: "red",
    }

    return (
      <div id="loadingSpinner">
        <p>Credit Check Started</p>
        <img src="../assets/Spinner.svg" />
      </div>
    )
  } else if (creditCheckSuccess) {
    return (
      <div>
        <p>Success</p>
        
        <p> Finished loading!</p>
      </div>
    )
  } else {
    return(
      <div>
        <p>Failure</p>
        <input type="File" onChange={onFileChange} />
        <button onClick={() => performCreditCheck(setIsLoading, setCreditCheckSuccess, selectedFile)}>Upload!</button>
      </div>
    )
  }
}




export default CreditSafeCheck;