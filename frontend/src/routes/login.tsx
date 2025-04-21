import { useState } from "react";
import { data, Form } from "react-router";
import { ACCESS_TOKEN_LIFETIME, accessTokenCookieManager, REFRESH_TOKEN_LIFETIME, refreshTokenCookieManager } from "../components/authentication";
import bcrypt from "bcryptjs";
import { GetUser } from "../components/database";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = import.meta.env.VITE_ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = import.meta.env.VITE_REFRESH_TOKEN_SECRET;

// LoginUser: Used for the login form
export async function action({request}: any) {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");

  const user = await GetUser(username);

  try {
    if(await bcrypt.compare(password, user.Pass)) {
      const cookieHeader = request.headers.get("Cookie");
      const accessTokenCookie = await accessTokenCookieManager.parse(cookieHeader) || {};
      const refreshTokenCookie = await refreshTokenCookieManager.parse(cookieHeader) || {};

      // Give them access token and refresh token      
      accessTokenCookie.accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_LIFETIME});
      refreshTokenCookie.refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_LIFETIME});

      return data("400", {
        headers: [
          ["Set-Cookie", await accessTokenCookieManager.serialize(accessTokenCookie)],
          ["Set-Cookie", await refreshTokenCookieManager.serialize(refreshTokenCookie)]
        ]
      });
    }
    console.log("Unsuccessful login");
    return data("500")
  } catch (err) {
    console.log(`Errors whilst logging in: ${err}`);
    return data("500")
  }
}

function Login({ actionData }: any){
  const [showPassword, setShowPassword] = useState(false);
  return(
      <>
          <Form id="loginForm" action="" method="post">                
              <span className="inputTitle"> Login </span>
              <input className="inputBox" name="username" type="text" placeholder="Enter Username"/>
              <input className="inputBox" name="password" type={showPassword ? "text" : "password" } placeholder="Enter Password"/>
              <button type="button" onClick={() => {setShowPassword(!showPassword);}}> {showPassword ? "Hide Password" : "Show Password" } </button>
              <button type="submit">Login</button>
          </Form>
          { actionData && actionData == "400" && <p> Logged in successfully! </p> }
          { actionData && actionData == "500" &&  <p> Error whilst logging in </p> }
      </>
  )
}

export default Login
