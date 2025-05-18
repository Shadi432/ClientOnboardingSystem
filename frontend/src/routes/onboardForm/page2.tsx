import { Dropdown, InputField } from "../../components/FormComponents";
import { useOutletContext } from "react-router";



function Page2(){
    const formStateHandler: { formState: {}, updateFormState: Function} = useOutletContext();
    const updateFormState = formStateHandler.updateFormState;
    const formState = formStateHandler.formState;

  return(
    <>
      <div>
        <p>Client Information</p>
        <Dropdown name="Title" label="Title:" options={["Mr", "Mrs", "Miss", "Master", "Dr"]} updateState={updateFormState} formState={formState} required={true} />
        <InputField name="FirstName" label="First Name:" updateState={updateFormState} formState={formState} required={true}/>
        <InputField name="MiddleName" label="Middle Name:" updateState={updateFormState} formState={formState} />
        <InputField name="LastName" label="Last Name:" updateState={updateFormState} formState={formState} required={true}/>
        <InputField name="Salutation" label="Salutation:" updateState={updateFormState} formState={formState} />
        <Dropdown name="Gender" label="Gender:" options={["Man", "Woman", "Non-Binary", "N/A"]} updateState={updateFormState} formState={formState} />
      </div>
      <div>
        <p>Contact Details</p>
        <InputField name="AddressLine1" label="Address Line 1:" updateState={updateFormState} formState={formState} required={true} />
        <InputField name="AddressLine2" label="Address Line 2:" updateState={updateFormState} formState={formState} />
        <InputField name="Town" label="Town:" updateState={updateFormState} formState={formState} required={true} />
        <InputField name="County" label="County:" updateState={updateFormState} formState={formState} />
        <InputField name="Country" label="Country:" updateState={updateFormState} formState={formState} required={true} />
        <InputField name="Postcode" label="Postcode:" updateState={updateFormState} formState={formState} required={true} />
      </div>
    </>
  )
}

export default Page2;