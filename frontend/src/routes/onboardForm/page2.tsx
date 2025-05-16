import { Dropdown, InputField } from "../../components/FormComponents";
import { useOutletContext } from "react-router";



function Page2(){
    const formStateHandler: { formState: {}, updateFormState: Function} = useOutletContext();
    const updateFormState = formStateHandler.updateFormState;
    const formState = formStateHandler.formState;

  return(
    <>
      <Dropdown name="Title" label="Title:" options={["Mr", "Mrs", "Miss", "Master", "Dr"]} updateState={updateFormState} formState={formState} required={true}/>
    </>
  )
}

export default Page2;