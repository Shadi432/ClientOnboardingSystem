import { IsUserAuthenticated } from "../../components/authentication";
import { data, Outlet, useNavigate } from "react-router"
import { useState } from "react"
import { GetOnboardingData } from "../../components/database";

const MAX_PAGES = 3

export async function loader({ params, request }: any){
  const responseData = await IsUserAuthenticated(request);
  
  if (responseData.clientResponse.success){
    const clientName = "TestClient"
    const fakeClientName = "Bernard Arnault"
    const jsonResult: any = await GetOnboardingData(fakeClientName);
    if (jsonResult){
      // return it as state in loaderData
    } else {
      // No existing data, blank record. return {} in loader data
    }

    if (params.clientName){
      console.log("Params: ", params)

    } else {
      // Blank form is all they need
    }
  }

  return data(responseData.clientResponse, {
    headers: [...responseData.headers],
  });
}

// This should have stuff like the forwards and back arrows etc, save button, etc.
// If save button is pressed it needs to send an action to the relevant page so that it takes data and uploads it to the db.
// This will also have a complete button and whenever it's pressed it'll make sure the current page saves then it'll redirect you to the home page.
// Will need to make sure that before any re-render that the data is saved so they don't lose data because of authentication
function OnboardForm( { loaderData }: any ){
  const [formState, updateFormState] = useState({});
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const navigate = useNavigate();

  async function submitToDB(formState: {}){
    console.log(formState);
    
    // We want to use the fields in the form state and verify them using zod.
    // If they pass the zod validation then they're ready to be submitted
    // We want them to match the fields in the database alongside some extra data we can put in here.
  }
  
  if (loaderData.success){
    return(
      <>
        <p className="requiredField">Fields marked with * are required</p>

          <Outlet context={{formState: formState, updateFormState: updateFormState}} />
          {/* These buttons need to make the call to store the current fields in the database. */}
          
          {currentPageNum > 1 && <button className="previousButton" type="button" onClick={() => {submitToDB(formState); setCurrentPageNum(currentPageNum - 1); navigate(`/onboardForm/page${currentPageNum-1}`)}}>Previous</button> }
          {currentPageNum < MAX_PAGES && <button className="nextButton" type="button" onClick={() => {submitToDB(formState); setCurrentPageNum(currentPageNum + 1); navigate(`/onboardForm/page${currentPageNum+1}`)}}>Next</button> }
          {currentPageNum == MAX_PAGES && <button> Finish </button>}
      </>
    )
  } 
  return (<p>Please log in to access this page</p>)
}

export default OnboardForm
