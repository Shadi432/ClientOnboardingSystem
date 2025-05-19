import { DateField, Dropdown, InputField, RadioButtonSet } from "../../components/FormComponents";
import { useOutletContext } from "react-router";


function Page3(){
  const formStateHandler: { formState: {}, updateFormState: Function} = useOutletContext();
  const updateFormState = formStateHandler.updateFormState;
  const formState = formStateHandler.formState;

  console.log(formState);
  return(
    <div>
      <p>Client Information</p>
     
      <DateField name="DateOfBirth" label="DOB:" updateState={updateFormState} formState={formState} required={true}/>
      <DateField name="DOD" label="DOD:" updateState={updateFormState} formState={formState} />
      <InputField name="VATNumber" label="VAT Number:" updateState={updateFormState} formState={formState} required={true}/>
      <InputField name="NINumber" label="NI Number:" updateState={updateFormState} formState={formState} required={true}/>
      <InputField name="UTR" label="UTR:" updateState={updateFormState} formState={formState} required={true} />
      <Dropdown name="TaxType" label="Tax Type:" options={["Income Tax", "Value Added Tax", "Corporation Tax"]} updateState={updateFormState} formState={formState} required={true} />
      <Dropdown name="TaxInvestigationCenter" label="Tax Investigation Center:" options={["Center1", "Center2", "Center3"]} updateState={updateFormState} formState={formState} required={true} />
      <DateField name="YearEnd" label="Year end:" updateState={updateFormState} formState={formState} />
      <RadioButtonSet name="IsVATInvoiceRequired" label="Is VAT invoice required?:" options={["Yes", "No"]} updateState={updateFormState} formState={formState}/>
    </div>
  )
}

export default Page3