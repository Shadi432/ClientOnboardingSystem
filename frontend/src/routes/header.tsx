import { data, Link,NavLink, Outlet } from "react-router";
import { accessTokenCookieManager, refreshTokenCookieManager } from "../components/cookies";
import { UserValidator, User } from "../components/types";
import jwt from "jsonwebtoken";

function logoutUser(e: any){
  console.log("Logout");
}

export async function loader({request}: any) {
  const ACCESS_TOKEN_SECRET = import.meta.env.VITE_ACCESS_TOKEN_SECRET;
  const cookieHeader = request.headers.get("Cookie");
  const accessTokenCookie = await accessTokenCookieManager.parse(cookieHeader) || {};
  const refreshTokenCookie = await refreshTokenCookieManager.parse(cookieHeader) || {};
  
  if (accessTokenCookie.accessToken == null) {
    console.log("They do not have access!");
    return
  }

  const user = jwt.verify(accessTokenCookie.accessToken, ACCESS_TOKEN_SECRET, (err: any, user: any) => {
    if (err) return data("They have an invalid access token");
    // If invalid access token we want to generate a new one and then set it.
    return user;
  });

  // If admin account show CreateUser button
  const validatedUser = UserValidator.safeParse(user);
  if (validatedUser.success == true){
    if (validatedUser.data.UserType == "Admin") {
      return data({ user });
    }
  }
};

function App( { loaderData }: any) {
  if (loaderData){
    console.log(loaderData.user);
  }
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
