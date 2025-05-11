import jwt from "jsonwebtoken";
import { createCookie } from "react-router";
import { UserAuthenticationData, UserValidator, User } from "../components/types";

const ACCESS_TOKEN_SECRET = import.meta.env.VITE_ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = import.meta.env.VITE_REFRESH_TOKEN_SECRET;
export const ACCESS_TOKEN_LIFETIME = "1m";
export const REFRESH_TOKEN_LIFETIME = "5m";
const SET_TOKEN_EXPIRED = "-1m";

export const accessTokenCookieManager = createCookie("accessToken", { "httpOnly": true });
export const refreshTokenCookieManager = createCookie("refreshToken", { "httpOnly": true });

export async function IsUserAuthenticated(request: any): Promise<{ clientResponse: { success: boolean, user: User | null }, headers: any[] }>  {
    // { user: user|null, verified: bool, setCookieHeaders = [[],[]] }
  const userAuthentication: UserAuthenticationData = await VerifyAccessToken(request);

  if (userAuthentication.success) {
      if (userAuthentication.headersList){
        return ({
          clientResponse: { success: true, user: userAuthentication.user }, 
          headers: userAuthentication.headersList
        });
      } else {
      return ({
        clientResponse: { success: true, user: userAuthentication.user },
        headers: [],
       });
      }
    } else {
      if (userAuthentication.headersList) {
        return {
          clientResponse: { success: false, user: null },
          headers: userAuthentication.headersList 
          };
      } else {
        return {
          clientResponse: { success: false, user: userAuthentication.user },
          headers: [],
        };
      }
  }
}

// Generates New Auth Tokens from Scratch
export async function GenerateAccessTokens(user: User): Promise<any[]> {
  // Give them access token and refresh tokens     
  const accessTokenCookie = {
    accessToken: jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_LIFETIME})
  };
  const refreshTokenCookie = {
    refreshToken: jwt.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_LIFETIME})
  };

  return([
      ["Set-Cookie", await accessTokenCookieManager.serialize(accessTokenCookie)],
      ["Set-Cookie", await refreshTokenCookieManager.serialize(refreshTokenCookie)]
    ]);
}


// Are the current access tokens valid.
export async function VerifyAccessToken(request: any): Promise<UserAuthenticationData> {
  const cookieHeader = request.headers.get("Cookie");
  
  const accessTokenCookie = await accessTokenCookieManager.parse(cookieHeader) || {};
  const refreshTokenCookie = await refreshTokenCookieManager.parse(cookieHeader) || {};
  
  

  if (accessTokenCookie.accessToken == null){
    console.log("They do not have an access token!");
    const authData: UserAuthenticationData = { success: false, headersList: null, user: null};
    return authData;
  } 
  
  try {
;    const user = await jwt.verify(accessTokenCookie.accessToken, ACCESS_TOKEN_SECRET);
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
      const authenticationDetails = await UpdateAuthTokens(accessTokenCookie, refreshTokenCookie);
      return authenticationDetails;

    // Been tampered with, invalidate the cookies so they're forced to log in again
    } else if (err instanceof jwt.JsonWebTokenError) {
      // Use set headers and set their date to negative.
      accessTokenCookie.accessToken = jwt.sign({}, ACCESS_TOKEN_SECRET, { expiresIn: SET_TOKEN_EXPIRED});
      refreshTokenCookie.refreshToken = jwt.sign({}, REFRESH_TOKEN_SECRET, { expiresIn: SET_TOKEN_EXPIRED});
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

// Takes auth token values and check if they're still valid/refresh if necessary.
export async function UpdateAuthTokens(accessTokenCookie: any, refreshTokenCookie: any): Promise<UserAuthenticationData>{
  let authenticationStatus: boolean = false;
  let headersList: any[] = [];
  let userObj: User | null = null;

  await jwt.verify(refreshTokenCookie.refreshToken, REFRESH_TOKEN_SECRET, (err: any, user: any) => {
    if (err){
      // Delete both cookies so they're logged out
      accessTokenCookie.accessToken = jwt.sign({}, ACCESS_TOKEN_SECRET, { expiresIn: SET_TOKEN_EXPIRED});
      refreshTokenCookie.refreshToken = jwt.sign({}, REFRESH_TOKEN_SECRET, { expiresIn: SET_TOKEN_EXPIRED});
      return
    }

    const validatedUser = UserValidator.safeParse(user);
    if (validatedUser.success){
      accessTokenCookie.accessToken = jwt.sign(validatedUser.data, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_LIFETIME});
      authenticationStatus = true;
      userObj = validatedUser.data;
    } else {
      console.log("Errors whilst parsing the user data");
      // This is a situation that shouldn't happen but if it does it should be handled.
      // They're left with a valid refresh token but no data could be gotten from it.
      accessTokenCookie.accessToken = jwt.sign({}, ACCESS_TOKEN_SECRET, { expiresIn: SET_TOKEN_EXPIRED});
      refreshTokenCookie.refreshToken = jwt.sign({}, REFRESH_TOKEN_SECRET, { expiresIn: SET_TOKEN_EXPIRED});
    }
  });

  headersList = [
    ["Set-Cookie", await accessTokenCookieManager.serialize(accessTokenCookie)],
    ["Set-Cookie", await refreshTokenCookieManager.serialize(refreshTokenCookie)]
  ]

  return {success: authenticationStatus, headersList: headersList, user: userObj};
}

export async function Logout(request: any): Promise<any>{
  const cookieHeader = request.headers.get("Cookie");
  const accessTokenCookie = await accessTokenCookieManager.parse(cookieHeader) || {};
  const refreshTokenCookie = await refreshTokenCookieManager.parse(cookieHeader) || {};

  accessTokenCookie.accessToken = jwt.sign({}, ACCESS_TOKEN_SECRET, { expiresIn: SET_TOKEN_EXPIRED});
  refreshTokenCookie.refreshToken = jwt.sign({}, REFRESH_TOKEN_SECRET, { expiresIn: SET_TOKEN_EXPIRED});

  return ([
    ["Set-Cookie", await accessTokenCookieManager.serialize(accessTokenCookie)],
    ["Set-Cookie", await refreshTokenCookieManager.serialize(refreshTokenCookie)]
  ])
}
