import { data, Form } from "react-router";
import { userData } from "../components/cookies";
import bcrypt from "bcryptjs";
import { GetUser } from "../components/database";

// LoginUser: Used for the login form
export async function action({request}: any) {
    const formData = await request.formData();
    const username = formData.get("username");
    const password = formData.get("password");
  
    const user = await GetUser(username);
    
    try {
      if(await bcrypt.compare(password, user.Pass)) {
        const cookieHeader = request.headers.get("Cookie");
        const cookie = await userData.parse(cookieHeader) || {};
        
        cookie.userData = user;
        return data("400", {
          headers: {
              "Set-Cookie": await userData.serialize(cookie),
          },
        })
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
            <Form id="loginForm" action="/login" method="post">                
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