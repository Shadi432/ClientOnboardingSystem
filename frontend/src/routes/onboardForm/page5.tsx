import { data, useOutletContext } from "react-router";
import { GetAllUsersByRole } from "../../components/database";
import { Dropdown } from "../../components/FormComponents";

export async function loader(){
  const partners = await GetAllUsersByRole("Partner");
  const mlros = await GetAllUsersByRole("MLRO");
  
  // Doing this so I don't expose some possibly sensitive user data by pushing the record in full
  const partnerNameList = [];
  for (const index in partners){
    partnerNameList.push(partners[index].Username);
  }

  const mlroNameList = [];
  for (const index in mlros){
    mlroNameList.push(mlros[index].Username);
  }

  return data({partnerList: partnerNameList, mlroList: mlroNameList});
}

function Finalise( { loaderData }: any){
  const formStateHandler: { formState: any, updateFormState: Function} = useOutletContext();
  const formState = formStateHandler.formState;
  const updateFormState = formStateHandler.updateFormState;

  // This initialisation is necessary because these intial values always need to be uploaded to the database or then no Partner/MLRO is selected, unlike other Dropdowns.
  if (!formState.FormState["PartnerToApprove"]){
    formState.FormState["PartnerToApprove"] = loaderData.partnerList[0]
  }

  if (!formState.FormState["MLROToApprove"]){
    formState.FormState["MLROToApprove"] = loaderData.mlroList[0];
  }

  return(
    <>
      <input readOnly value={`Form Prepared by: ${formState["Owner"]}`} />
      <Dropdown name="PartnerToApprove" label="Partner Approval:" options={loaderData.partnerList} updateState={updateFormState} formState={formState} required={true} />
      <Dropdown name="MLROToApprove" label="MLRO Approval:" options={loaderData.mlroList} updateState={updateFormState} formState={formState} required={true} />
    </>
  )
}

export default Finalise;