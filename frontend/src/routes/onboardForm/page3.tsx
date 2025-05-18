import { DateField } from "../../components/FormComponents";
import { useOutletContext } from "react-router";


function Page3(){
  const formStateHandler: { formState: {}, updateFormState: Function} = useOutletContext();
  const updateFormState = formStateHandler.updateFormState;
  const formState = formStateHandler.formState;

  
  return(
    <div>
      <p>Client Information</p>
     
      <DateField name="DateOfBirth" label="Date:" updateState={updateFormState} formState={formState} required={true}/>
      <DateField name="DOD" label="DOD:" updateState={updateFormState} formState={formState} />
    </div>
  )
}

export default Page3