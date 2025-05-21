import { useOutletContext } from "react-router";
import { Dropdown } from "../../components/FormComponents";

function TradingAs(){
  const formStateHandler: { formState: any, updateFormState: Function} = useOutletContext();
  const formState = formStateHandler.formState;
  const updateFormState = formStateHandler.updateFormState;

  return(
    <>
      <input readOnly value={`Form Prepared by: ${formState["Owner"]}`} />

      <div>
        {/* <Dropdown name="PartnerApproval" label="Partner approval:" updateState={updateFormState} formState={formState} required={true}/> */}
      </div>

      <div>
        {/* <Dropdown name="MLROApproval" label="MLRO/Deputy Approval:" updateState={updateFormState} formState={formState} required={true} /> */}
      </div>
    </>
  )
}

export default TradingAs