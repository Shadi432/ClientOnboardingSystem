import { IsUserAuthenticated } from "../components/authentication";
import { data, Link, useNavigate } from "react-router"
import { ClientFormData, User, UserValidator } from "../components/types";
import { GetAllClientFormsByOwner } from "../components/database";

export async function loader({ request }: any) {
  // console.log(request);
  const responseData = await IsUserAuthenticated(request);
  
  if (responseData.clientResponse.success) {
    const ownedForms = await GetAllClientFormsByOwner(UserValidator.parse(responseData.clientResponse.user));
      // Anything that requires authentication in here.
    return data({...responseData.clientResponse, formList: ownedForms}, {
        headers: [...responseData.headers],
    });
  } else {

  }

  return data(responseData.clientResponse, {
    headers: [...responseData.headers],
  });
};


function Home( { loaderData }: any) {
    const navigate = useNavigate();
    
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
                return(<><p>MLRO!</p></>);
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