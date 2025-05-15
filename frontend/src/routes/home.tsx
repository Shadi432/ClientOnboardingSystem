import { IsUserAuthenticated } from "../components/authentication";
import { data, Link } from "react-router"
import { User } from "../components/types";

let testList: string[] = [];

for (let i=0; i<100; i++){
    testList[i] = (`RandomName${i}`);
}

export async function loader({ request }: any) {
  // console.log(request);
  const responseData = await IsUserAuthenticated(request);
  
  if (responseData.clientResponse.success) {
    // Anything that requires authentication in here.
  } else {

  }

  return data(responseData.clientResponse, {
    headers: [...responseData.headers],
  });
};

const selectClient = (event: any) => {
    if (event.target.value != ""){
        const clientName: string = event.target.value
        console.log(clientName);
        // Need to redirect the user to a form page and pass in the clientName as props
    }
}

function Home( { loaderData }: any) {
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
                                { testList.map((item, index) => <option value={item} key={index}> {item} </option>)}
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