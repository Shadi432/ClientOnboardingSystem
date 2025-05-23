import { data, Link,NavLink, Outlet, useFetcher } from "react-router";
import { IsUserAuthenticated } from "../components/authentication";
import { User, UserValidator } from "../components/types";

export async function loader({ request }: any) {
  const responseData = await IsUserAuthenticated(request);
  
  // Anything that requires authentication in here.
  if (responseData.clientResponse.success) {
    const user: User = UserValidator.parse(responseData.clientResponse.user);
    return data({userType: user.UserType}, {
      headers: [...responseData.headers],
    })
  }

  return data({userType: null}, {
    headers: [...responseData.headers],
  });
};

function App( { loaderData }: any) {
  let fetcher = useFetcher();

  return (
    <>
      <nav id="header">
          <h1>Client Onboarding System</h1>
          { loaderData && loaderData.userType && <NavLink className="ribbonButton" to="home"> Home </NavLink> }
          <NavLink className="ribbonButton" to="login"> Login </NavLink>
          { loaderData && loaderData.userType == "Admin" && <Link className="ribbonButton" to="createUser"> Create User </Link> }
          { loaderData && loaderData.userType && <button className="ribbonButton" type="button" onClick={() => { fetcher.submit({}, { action: "logout", method: "post" }); } }> Logout </button> }
      </nav>
      <Outlet />
    </>
  )
}

export default App
