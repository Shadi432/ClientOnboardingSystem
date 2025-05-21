import { data, useOutletContext } from "react-router";
import { Dropdown } from "../../components/FormComponents";
import { GetAllUsersByRole } from "../../components/database";

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

function TradingAs( { loaderData }: any){
  const formStateHandler: { formState: any, updateFormState: Function} = useOutletContext();
  const formState = formStateHandler.formState;
  const updateFormState = formStateHandler.updateFormState;

  return(
    <>
      <input readOnly value={`Form Prepared by: ${formState["Owner"]}`} />

      <div>
        <Dropdown name="PartnerApproval" label="Partner approval:" options={loaderData.partnerList} updateState={updateFormState} formState={formState} required={true}/>
      </div>

      <div>
        <Dropdown name="MLROApproval" label="MLRO/Deputy Approval:" options={loaderData.mlroList} updateState={updateFormState} formState={formState} required={true} />
      </div>
    </>
  )
}

export default TradingAs