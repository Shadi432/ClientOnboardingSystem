import { IsUserAuthenticated } from "../components/authentication";
import { data, Link, useFetcher, useNavigate } from "react-router"
import { ClientFormData, User, UserValidator } from "../components/types";
import { CreateNewClient, GetAllClientFormsByOwner, GetClientFormByName, GetFormsToApprove } from "../components/database";

export async function loader({ request }: any) {
  const responseData = await IsUserAuthenticated(request);
  
  let ownedForms: any = []

  if (responseData.clientResponse.success) {
    const user = UserValidator.parse(responseData.clientResponse.user);
    const userType: any = user.UserType;

    if (userType == "Secretary"){
        ownedForms = await GetAllClientFormsByOwner(UserValidator.parse(responseData.clientResponse.user));
    } else if (userType == "Partner" || "MLRO"){
        ownedForms = await GetFormsToApprove(user.Username);
    }
    
      // Anything that requires authentication in here.
    return data({...responseData.clientResponse, formList: ownedForms}, {
        headers: [...responseData.headers],
    });
  }

  return data(responseData.clientResponse, {
    headers: [...responseData.headers],
  });
};

export async function action( { request }: any) {
    const formData = await request.formData();
    const userType = formData.get("userType");
    const clientName = formData.get("clientName");

    let targetRecord: any = await GetClientFormByName(clientName);
    targetRecord[`${userType}Approved`] = "true";

    if (targetRecord["MLROApproved"] == "true" && targetRecord["PartnerApproved"] == "true"){
        targetRecord.Status = "Completed"
    }
    
    const result = await CreateNewClient(targetRecord);
    if (result != null){
        console.log(`DB Error: ${result}`);
    }
}

    // Call to a client action?

    // Server action needs to have a function that sets UserTypeApproved to True for clientName
    // It also needs to get the record and here I can check if OtherTypeApproved = true. 
    // If otehr type approved = true set it to complete instead of in-progress.
    // If not then we can just finish.


function Home( { loaderData }: any) {
    const navigate = useNavigate();
    const fetcher = useFetcher();
    
    const selectClient = (event: any) => {
        if (event.target.value != ""){
            const clientName: string = event.target.value
            // Need to redirect the user to a form page and pass in the clientName as props
            navigate(`/onboardForm/${clientName}/page1`)
        }
    }

    if (loaderData.success) {
        const user: User = loaderData.user;

        switch (user.UserType){
            case "Admin":
                return(<><p>Admin!</p></>);

            case "MLRO":
            case "Partner":
                return(
                <div id="approvalSelector">
                    <h1 id="pendingReview">Pending Review</h1>
                    { loaderData.formList.map((formData: ClientFormData) => <div className="reviewOption" key={formData.ClientName}><p className="reviewTitle">Client Name: {formData.ClientName} Secretary: {formData.Owner} </p> <button className="reviewSubmit" type="button" onClick={() => fetcher.submit({"userType": user.UserType, "clientName": formData.ClientName}, {action:"", method:"post"})}>Approve</button></div>)}
                </div>
            )
            case "Secretary":
                return(
                    <>
                        <Link to="/onboardForm/page1" id="newClientButton">Onboard New Client</Link>
                        
                        <div id="existingClientSelector">
                            <p>Continue Onboarding an Existing Client</p>
                            <select id="existingClientDropdown" name="userType" onChange={selectClient}>
                                <option value="">Select a client</option>
                                { loaderData.formList.map((formData: ClientFormData) => <option key={formData.ClientName}> {formData.ClientName}</option>)}
                            </select>
                        </div>
                    </>
                )
            default:
                return (<p>Please log in to access this page.</p>)
        }
    }
    
}

export default Home