import { data, Form } from "react-router";
import { accessTokenCookieManager, refreshTokenCookieManager } from "../components/cookies";
import bcrypt from "bcryptjs";
import { GetUser } from "../components/database";
import jwt from "jsonwebtoken";

// LoginUser: Used for the login form
export async function action({request}: any) {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");

  const user = await GetUser(username);

  const ACCESS_TOKEN_SECRET = import.meta.env.VITE_ACCESS_TOKEN_SECRET;
  const REFRESH_TOKEN_SECRET = import.meta.env.VITE_REFRESH_TOKEN_SECRET;
  
  try {
    if(await bcrypt.compare(password, user.Pass)) {
      const cookieHeader = request.headers.get("Cookie");
      const accessTokenCookie = await accessTokenCookieManager.parse(cookieHeader) || {};
      const refreshTokenCookie = await refreshTokenCookieManager.parse(cookieHeader) || {};

      // Give them access token and refresh token
      const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: "1m"});
      const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: "5m"});
      
      accessTokenCookie.accessToken = accessToken;
      refreshTokenCookie.refreshToken = refreshToken;

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
    return(
        <>
            <Form id="loginForm" action="" method="post">                
                <span className="inputTitle"> Login </span>
                <input className="inputBox" name="username" type="text" placeholder="Enter Username"/>
                <input className="inputBox" name="password" type="text" placeholder="Enter Password"/>
                <button type="submit">Login</button>
            </Form>
            { actionData && actionData == "400" && <p> Logged in successfully! </p> }
            { actionData && actionData == "500" &&  <p> Error whilst logging in </p> }
        </>
    )
}

export default Login
