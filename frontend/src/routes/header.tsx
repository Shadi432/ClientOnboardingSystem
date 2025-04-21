import { data, Link,NavLink, Outlet } from "react-router";
import { accessTokenCookieManager, refreshTokenCookieManager } from "../components/cookies";
import { UserAuthenticationData, UserValidator, User } from "../components/types";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = import.meta.env.VITE_ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = import.meta.env.VITE_REFRESH_TOKEN_SECRET;

function logoutUser(e: any){
  console.log("Logout");
}

async function GenerateNewAuthTokens(accessTokenCookie: any, refreshTokenCookie: any){
  let authenticationStatus: boolean = false;
  let headersList: any[] = [];
  let userObj: User | null = null;

  await jwt.verify(refreshTokenCookie.refreshToken, REFRESH_TOKEN_SECRET, (err: any, user: any) => {
    if (err){
      // Delete both cookies so they're logged out
      accessTokenCookie.accessToken = jwt.sign({}, ACCESS_TOKEN_SECRET, { expiresIn: "-1m"});
      refreshTokenCookie.refreshToken = jwt.sign({}, REFRESH_TOKEN_SECRET, { expiresIn: "-1m"});
      return
    }

    const validatedUser = UserValidator.safeParse(user);
    if (validatedUser.success){
      accessTokenCookie.accessToken = jwt.sign(validatedUser.data, ACCESS_TOKEN_SECRET, { expiresIn: "1m"});
      authenticationStatus = true;
      userObj = validatedUser.data;
    } else {
      console.log("Errors whilst parsing the user data");
      // This is a situation that shouldn't happen but if it does it should be handled.
      // They're left with a valid refresh token but no data could be gotten from it.
      accessTokenCookie.accessToken = jwt.sign({}, ACCESS_TOKEN_SECRET, { expiresIn: "-1m"});
      refreshTokenCookie.refreshToken = jwt.sign({}, REFRESH_TOKEN_SECRET, { expiresIn: "-1m"});
    }
  });

  headersList = [
    ["Set-Cookie", await accessTokenCookieManager.serialize(accessTokenCookie)],
    ["Set-Cookie", await refreshTokenCookieManager.serialize(refreshTokenCookie)]
  ]

  return {success: authenticationStatus, headersList: headersList, user: userObj};
}

async function VerifyAccessToken(request: any): Promise<UserAuthenticationData> {
  const cookieHeader = request.headers.get("Cookie");
  const accessTokenCookie = await accessTokenCookieManager.parse(cookieHeader) || {};
  const refreshTokenCookie = await refreshTokenCookieManager.parse(cookieHeader) || {};

  if (accessTokenCookie.accessToken == null){
    console.log("They do not have an access token!");
    const authData: UserAuthenticationData = { success: false, headersList: null, user: null};
    return authData;
  } 

  try {
    const user = await jwt.verify(accessTokenCookie.accessToken, ACCESS_TOKEN_SECRET);
    const validatedUser = UserValidator.safeParse(user);

    if (validatedUser.success) {
      const authData: UserAuthenticationData = { success: true, headersList: null, user: validatedUser.data};
      return authData;
    } else {
      const authData: UserAuthenticationData = { success: false, headersList: null, user: null};
      return authData;
    }
  } catch (err) {
    // Generate a new access token from the refresh token
    if (err instanceof jwt.TokenExpiredError) {
      const authenticationDetails = await GenerateNewAuthTokens(accessTokenCookie, refreshTokenCookie);
      return authenticationDetails;

    // Been tampered with, invalidate the cookies so they're forced to log in again
    } else if (err instanceof jwt.JsonWebTokenError) {
      // Use set headers and set their date to negative.
      accessTokenCookie.accessToken = jwt.sign({}, ACCESS_TOKEN_SECRET, { expiresIn: "-1m"});
      refreshTokenCookie.refreshToken = jwt.sign({}, REFRESH_TOKEN_SECRET, { expiresIn: "-1m"});
      const headersList = [
        ["Set-Cookie", await accessTokenCookieManager.serialize(accessTokenCookie)],
        ["Set-Cookie", await refreshTokenCookieManager.serialize(refreshTokenCookie)]
      ]

      const authData: UserAuthenticationData = { success: false, headersList: headersList, user: null}
      return authData
    }
  }
  const authData: UserAuthenticationData = { success: false, headersList: null, user: null } 
  return authData
}

export async function loader({request}: any) {
  // { user: user|null, verified: bool, setCookieHeaders = [[],[]] }
  const userAuthentication: UserAuthenticationData = await VerifyAccessToken(request);

  // Need to parse this into a type using zod
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
