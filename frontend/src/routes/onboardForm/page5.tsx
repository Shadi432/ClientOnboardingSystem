import { data, useOutletContext } from "react-router";
import { GetAllUsersByRole } from "../../components/database";
import { useEffect } from "react";

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

  if (!formState.FormState["PartnerToApprove"]){
    formState.FormState["PartnerToApprove"] = loaderData.partnerList[0]
  }

  if (!formState.FormState["MLROToApprove"]){
    formState.FormState["MLROToApprove"] = loaderData.mlroList[0];
  }

  return(
    <>
      <input readOnly value={`Form Prepared by: ${formState["Owner"]}`} />

      <div className="dropdown">
        <span className="formLabel"> Partner Approval:</span>
        <select name="PartnerToApprove" defaultValue={formState.FormState["PartnerToApprove"]} onChange={(e) => {formState.FormState["PartnerToApprove"] = e.target.value; console.log(formState); updateFormState(formState)}}>
          { loaderData.partnerList.map((name: string) => <option key={name}>{ name }</option>)}
        </select>
      </div>

      <div className="dropdown">
        <span className="formLabel"> MLRO Approval:</span>
        <select name="MLROToApprove" defaultValue={formState.FormState["MLROToApprove"]} onChange={(e) => {formState.FormState["MLROToApprove"] = e.target.value; console.log(formState); updateFormState(formState)}}>
          { loaderData.mlroList.map((name: string) => <option key={name}>{ name }</option>)}
        </select>
      </div>
    </>
  )
}

export default Finalise;