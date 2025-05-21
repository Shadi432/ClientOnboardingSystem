import { useOutletContext } from "react-router";

function TradingAs(){
  const formStateHandler: { formState: {FormState: any}, updateFormState: Function} = useOutletContext();
  const formState = formStateHandler.formState;
  const updateFormState = formStateHandler.updateFormState;

  return(
    <>
      <p>Something here</p>
    </>
  )
}

export default TradingAs