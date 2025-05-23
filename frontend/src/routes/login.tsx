import { useState } from "react";
import { data, Form } from "react-router";
import { GenerateAccessTokens } from "../components/authentication";
import bcrypt from "bcryptjs";

const IS_TESTING_MODE = import.meta.env.VITE_IS_TESTING_MODE || "false";

import { GetUser } from "../components/database"
// import { GetUser } from "../components/database";

// LoginUser: Used for the login form
export async function action({request}: any) {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");

  const user = await GetUser(username);
  
  try {
    if(await bcrypt.compare(password, user.Pass)) {

      const cookieHeaders = await GenerateAccessTokens(user);
      return data("400", {
        headers: [...cookieHeaders]
      });
    } else {
      console.log("Unsuccessful login: Incorrect password entered!");
      return data("500")
    }
  } catch (err) {
    console.log(`Errors whilst logging in: ${err}`);
    return data("500")
  }
}

function Login({ actionData }: any){
  const [showPassword, setShowPassword] = useState(false);

  return(
    <div id="loginForm">
      <Form  action="" method="post">                
        <span className="inputTitle"> Login </span>
        <input className="inputBox" name="username" type="text" placeholder="Enter Username"/>
        <input className="inputBox" name="password" type={showPassword ? "text" : "password" } placeholder="Enter Password"/>
        <button type="button" onClick={() => {setShowPassword(!showPassword);}}> {showPassword ? "Hide Password" : "Show Password" } </button>
        <button type="submit">Login</button>
      </Form>
      { actionData && actionData == "400" &&  <p> Successfully logged in </p> }
      { actionData && actionData == "500" && <p> Error whilst logging in </p> }
    </div>
  )
  
}

export default Login
