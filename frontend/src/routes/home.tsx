import { IsUserAuthenticated } from "../components/authentication";
import { data, Link } from "react-router"
import { User } from "../components/types";

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

function Home( { loaderData }: any) {
    if (!loaderData.success) {
        return (
            <div style={{ textAlign: 'center', marginTop: '10vh' }}>
                <p>Please log in to access this page.</p>
            </div>
        )
    } else {
        const user: User = loaderData.user;
        return(
            <>
                { user.UserType == "Admin" ? console.log("Admin user") : console.log("Non-admin user") }
                <Link to="/newForm">Onboard New Client</Link>
                <p>Continue Onboarding an Existing Client</p>
            </>
        )
    }
}

export default Home