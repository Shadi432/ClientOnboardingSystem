import { IsUserAuthenticated } from "../../components/authentication";
import { data, Outlet, useFetcher, useNavigate } from "react-router"
import { useState } from "react"
import { CreateNewClient, GetClientFormByName } from "../../components/database";
import { ClientFormDataValidator, User, UserValidator } from "../../components/types";

const MAX_PAGES = 3


export async function action({ request }: any){
  const formData = await request.formData()
  let formState = formData.get("formState");
  const result = await CreateNewClient(JSON.parse(formState));
  if ( result != null){
    console.log(`DB Error: ${result}`);
  }
}

export async function loader({ params, request }: any){
  const responseData = await IsUserAuthenticated(request);
  let clientName = "";

  if (responseData.clientResponse.success){    
    const currentUser: User = UserValidator.parse(responseData.clientResponse.user);
    
    if (params.clientName) {
      clientName = params.clientName;
    }
    // This has to check that the current user owns the data or then you can change the link and get any record returned.
      const jsonResult: any = await GetClientFormByName(clientName, currentUser);
      if (jsonResult.Owner && jsonResult.Owner != ""){
        // console.log(jsonResult);
        return data({...responseData.clientResponse, formState: jsonResult} , {
          headers: [...responseData.headers],
        });
      } else {
        // No existing data, blank record.
        return data({...responseData.clientResponse, formState: {ClientName: "", Owner: currentUser.Username, Status: "In Progress", FormState: {}}} , {
          headers: [...responseData.headers],
        });
      }
  }
  // Unauthenticated client
   return data({...responseData.clientResponse} , {
        headers: [...responseData.headers],
  });
}

function formStateValidator(formState: any): {headerCheck: boolean, contentCheck: boolean, errorList: string[]}{
  const clientNameCheck = ClientFormDataValidator.shape.ClientName.safeParse(formState.ClientName);

  const formDataCheck: any = ClientFormDataValidator.shape.FormState.required().safeParse(formState.FormState);
  /* Need to do this because I declare these fields as partial so that they're not required so we can load them in
    against the validator but we need to actually check them and have it be non-negotiable so they're valid befopre
    they're stored in the database.
  */

  let errorList: string[] = [];

  if (!clientNameCheck.success){
    errorList.push(`ClientName: ${clientNameCheck.error.errors[0].message}`);
  }
  
  if (!formDataCheck.success){
    formDataCheck.error.errors.map((error: any) => errorList.push(`${error.path[0]}: ${error.message}`));
  }
  

  return {headerCheck: clientNameCheck.success, contentCheck: formDataCheck.success, errorList: errorList};
}

// This should have stuff like the forwards and back arrows etc, save button, etc.
// If save button is pressed it needs to send an action to the relevant page so that it takes data and uploads it to the db.
// This will also have a complete button and whenever it's pressed it'll make sure the current page saves then it'll redirect you to the home page.
// Will need to make sure that before any re-render that the data is saved so they don't lose data because of authentication
function FormParent( { loaderData }: any ){
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const navigate = useNavigate();
  // Annoying because I'm trusting formState to be there and it won't be in the case of a authentication failure but it also won't be called in that case so it wouldn't error.
  const [formState, updateFormState] = useState(loaderData.formState);
  const [canProceed, setCanProceed] = useState(true); 
  const [errList, setErrList] = useState([""]);

  let fetcher = useFetcher();

  
  if (loaderData.success){
    // Has to be done here if not react is unsure how many hooks to render.
    return(
      <>
        <p className="requiredField">Fields marked with * are required</p>

        <Outlet context={{formState: formState, updateFormState: updateFormState}} />

        {/* Div is for styling purposes use it well. */}
        <div>
          { !canProceed && errList.map((err) => <p style={{display: "block"}} key={err}> {err} </p>) }
        </div>
        {currentPageNum > 1 && <button className="previousButton" type="button" onClick={() => { setCurrentPageNum(currentPageNum - 1); navigate(`/onboardForm/page${currentPageNum-1}`)}}>Previous</button> }
        {currentPageNum < MAX_PAGES && <button className="nextButton" type="button" onClick={() => { setCurrentPageNum(currentPageNum + 1); navigate(`/onboardForm/page${currentPageNum+1}`) } }>Next </button> }
        
        <button className="saveButton" type="button" onClick={() => {
          const checkDetails = formStateValidator(formState);
          if (checkDetails.headerCheck){
            setCanProceed(true);
            fetcher.submit({ formState: JSON.stringify(formState) }, {action:"", method: "post"});
            navigate(`/home`);
          } else {
            setCanProceed(false);
            setErrList(checkDetails.errorList);
          }
        } }>Save and Quit</button>

        {currentPageNum == MAX_PAGES && <button type="button" onClick={() => {
            const checkDetails = formStateValidator(formState);
            if (checkDetails.headerCheck && checkDetails.contentCheck) {
              console.log("Here??")
              setCanProceed(true);
              fetcher.submit({ formState: JSON.stringify(formState) }, {action:"", method: "post"});
              navigate(`/home`)
            } else {
              setCanProceed(false);
              setErrList(checkDetails.errorList);
            }
          }}> Finish </button>}
      </>
    )
  } 
  return (<p>Please log in to access this page</p>)
}

export default FormParent
