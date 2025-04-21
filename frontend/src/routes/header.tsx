import { data, Link,NavLink, Outlet } from "react-router";
import { UserAuthenticationData } from "../components/types";
import { VerifyAccessToken } from "../components/authentication";

function logoutUser(e: any){
  console.log("Logout");
}

export async function loader({request}: any) {
  // { user: user|null, verified: bool, setCookieHeaders = [[],[]] }
  const userAuthentication: UserAuthenticationData = await VerifyAccessToken(request);

  if (userAuthentication.success) {
    if (userAuthentication.headersList){
      return data({response: "500", user: userAuthentication.user}, {
        headers: [...userAuthentication.headersList]
      });
    }
    return data({response: "Success", user: userAuthentication.user });
  } else {
    if (userAuthentication.headersList) {
      return data("error", {
        headers: [...userAuthentication.headersList]
      })
    } else {
      return data("not authenticated");
    }
  }
};

function App( { loaderData }: any) {
  return (
    <>
      <nav id="header">
          <h1>Client Onboarding System</h1>
          <NavLink to="login"> Login </NavLink>
          { loaderData && loaderData.user && loaderData.user.UserType == "Admin" && <Link to="createUser"> Create User </Link> }
          { loaderData && loaderData.user && <button type="button" onClick={logoutUser}> Logout </button> }
      </nav>
      <Outlet />
    </>
  )
}

export default App
