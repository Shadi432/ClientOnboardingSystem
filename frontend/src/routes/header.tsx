import { data, Link,NavLink, Outlet, useFetcher } from "react-router";
import { IsUserAuthenticated } from "../components/authentication";

export async function loader({ request }: any) {
  // console.log(request);
  const responseData = await IsUserAuthenticated(request);
  
  if (responseData.clientResponse.success) {
    // Anything that requires authentication in here.
  }

  return data(responseData.clientResponse, {
    headers: [...responseData.headers],
  });
};

function App( { loaderData }: any) {
  let fetcher = useFetcher();

  return (
    <>
      <nav id="header">
          <h1>Client Onboarding System</h1>
          { loaderData.success && loaderData.user && <NavLink className="ribbonButton" to="home"> Home </NavLink> }
          <NavLink className="ribbonButton" to="login"> Login </NavLink>
          { loaderData && loaderData.user && loaderData.user.UserType == "Admin" && <Link className="ribbonButton" to="createUser"> Create User </Link> }
          { loaderData && loaderData.user && <button className="ribbonButton" type="button" onClick={() => { fetcher.submit({}, { action: "logout", method: "post" }); } }> Logout </button> }
      </nav>
      <Outlet />
    </>
  )
}

export default App
