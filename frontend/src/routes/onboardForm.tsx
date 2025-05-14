import { IsUserAuthenticated } from "../components/authentication";
import { data } from "react-router";

export async function loader({ params, request }: any){
  const responseData = await IsUserAuthenticated(request);

  if (responseData.clientResponse.success){
    if (params.clientName){
      // Do processing to get and return the existing data to the client to continue the form where they left off.
      // This should be stored in the cookies so that they can continue through the pages
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
  if (loaderData.success){
    return(
      <>
        <p>Lol</p>
      </>
    )
  } 
  return (<p>Please log in to access this page</p>)
}

export default OnboardForm
