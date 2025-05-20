import { useState } from "react";
import { DateField, Dropdown, InputField, RadioButtonSet } from "../../components/FormComponents";
import { useOutletContext } from "react-router";


function Page3(){
  const formStateHandler: { formState: {FormState: any}, updateFormState: Function} = useOutletContext();
  const updateFormState = formStateHandler.updateFormState;
  const formState = formStateHandler.formState;

  let defaultBillingAddressDisplay = false;
  let showBillingAddressOptions = ["Yes", "No"];
  let billingAddressLabel = "Is billing address same as main address?";
  let billingAddressName = "IsSameAsBillingAddress";
  
  // Initialisation means that the last element is always the default value. Works for now because last element can always be no.
  if (!(formState.FormState.hasOwnProperty(billingAddressName))){
    formState.FormState[billingAddressName] = showBillingAddressOptions[0]
  } else if (formState.FormState[billingAddressName] == "No") {
    defaultBillingAddressDisplay = true; 
  }
  const [displayBillingAddress, setDisplayBillingAddress] = useState(defaultBillingAddressDisplay);
  return(
    <>
      <div>
        <p>Client Information</p>
        <div>
          <DateField name="DateOfBirth" label="DOB:" updateState={updateFormState} formState={formState} required={true}/>
          <DateField name="DOD" label="DOD:" updateState={updateFormState} formState={formState} />
          <InputField name="VATNumber" label="VAT Number:" updateState={updateFormState} formState={formState} required={true}/>
          <InputField name="NINumber" label="NI Number:" updateState={updateFormState} formState={formState} required={true}/>
          <InputField name="UTR" label="UTR:" updateState={updateFormState} formState={formState} required={true} />
          <Dropdown name="TaxType" label="Tax Type:" options={["Income Tax", "Value Added Tax", "Corporation Tax"]} updateState={updateFormState} formState={formState} required={true} />
          <Dropdown name="TaxInvestigationCenter" label="Tax Investigation Center:" options={["Center1", "Center2", "Center3"]} updateState={updateFormState} formState={formState} required={true} />
          <DateField name="YearEnd" label="Year end:" updateState={updateFormState} formState={formState} />
          <RadioButtonSet name="IsVATInvoiceRequired" label="Is VAT invoice required?" options={["Yes", "No"]} updateState={updateFormState} formState={formState}/>
          <RadioButtonSet name="IsStatementRequired" label="Is Statement required?" options={["Yes", "No"]} updateState={updateFormState} formState={formState} />
        </div>

      </div>
      <div style={{marginLeft: "10%"}}>        
        <span>{billingAddressLabel}</span>
        { showBillingAddressOptions.map((option: string) => {
            let defaultValue = option == formState.FormState[billingAddressName]
            return(<div key={option} style={{display: "inline"}}><input defaultChecked={defaultValue} type="radio" name={billingAddressName} value={option} onChange={(e) => {formState.FormState[billingAddressName] = e.target.value; updateFormState(formState); setDisplayBillingAddress(e.target.value == "No") }}/> <span>{option}</span> </div>)
          })
        }
        { displayBillingAddress && 
          <div>
            <InputField name="BillingLine1" label="Billing Line 1:" updateState={updateFormState} formState={formState} required={true}/>
            <InputField name="BillingLine2" label="Billing Line 2:" updateState={updateFormState} formState={formState} />
            <InputField name="BillingTown" label="Town:" updateState={updateFormState} formState={formState} required={true}/>
            <InputField name="BillingCounty" label="County:" updateState={updateFormState} formState={formState} />
            <InputField name="BillingCountry" label="Country:" updateState={updateFormState} formState={formState} required={true} />
            <InputField name="BillingPostcode" label="Postcode:" updateState={updateFormState} formState={formState} required={true} />
          </div>
        }
        <InputField name="EmailCorrespondence" label="Email Correspondence:" updateState={updateFormState} formState={formState} required={true} />
        <Dropdown name="EmailFeeNote" label="Email Fee note:" options={["Note1", "Note2"]} updateState={updateFormState} formState={formState} required={true} />
        <Dropdown name="EmailVATInvoice" label="Email VAT Invoice:" options={["EmailInvoice1", "EmailInvoice2"]} updateState={updateFormState} formState={formState} required={true} />
        <Dropdown name="EmailStatement" label="Email Statement:" options={["EmailStatement1", "EmailStatement2"]} updateState={updateFormState} formState={formState} required={true} />
        <InputField name="BackupEmail" label="Backup Email:" updateState={updateFormState} formState={formState} />
        <InputField name="Telephone1" label="Telephone(1):" updateState={updateFormState} formState={formState} required={true} />
        <InputField name="Telephone2" label="Telephone(2):" updateState={updateFormState} formState={formState} />
        <InputField name="Mobile" label="Mobile:" updateState={updateFormState} formState={formState} />
      </div>
    </>
  )
}

export default Page3