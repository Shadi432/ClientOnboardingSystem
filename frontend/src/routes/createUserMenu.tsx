import { data, Form } from "react-router";
import bcrypt from "bcryptjs";
import { CreateUser } from "../components/database";
import { User, UserValidator } from "../components/types";
import { useState } from "react";


export async function action({request} : any){
  let formData = await request.formData();
  let userLogin: User = {
    Username: formData.get("username"),
    Pass: formData.get("password"),
    Email: formData.get("email"),
    UserType: formData.get("userType")
  } 

  const userValidation = UserValidator.safeParse(userLogin);
  if (!userValidation.success) {
    // Return the first error so that the user can fix it.
    return data({ err: userValidation.error.errors[0].message });
  }

  // Hashing password
  try {
    userLogin.Pass = await bcrypt.hash(userLogin.Pass, 10);
  } catch (err) {
    console.log(err);
    return data({ err: "An unexpected error occurred, try again"});
  }

  let error = await CreateUser(userLogin);

  if (error != null) {
    if (error.toString().includes("Violation of UNIQUE KEY constraint")){
      return data({ err: "This username already exists" });
    }
  }

  return data({success: true})
}

function CreateUserMenu( { actionData }: any){
  const [showPassword, setShowPassword] = useState(false);
  return(
    <>
      <Form action="" method="post">
        <span className="inputTitle">Create a New User </span>
        <input className="inputBox" name="username" type="text" placeholder="Enter Username"/>
        <input className="inputBox" name="password" type={showPassword ? "text" : "password" } placeholder="Enter Password"/>
        <input className="inputBox" name="email" type="text" placeholder="Enter Email"/>
        {/* Selct user role? Dropdown Menu */}
        <select id="userTypeDropdown" name="userType">
          <option value="Secretary">Secretary</option>
          <option value="Manager">Manager</option>
          <option value="MLRO">MLRO</option>
        </select>
        <button type="button" onClick = {() => {setShowPassword(!showPassword);}}> {showPassword ? "Hide Password" : "Show Password" } </button>
        <button type="submit"> Create Account </button>
        { actionData && actionData.err && <p> { actionData.err }</p>}
        { actionData && actionData.success && <p> Account created successfully! </p>}
      </Form>
    </>
  )
}

export default CreateUserMenu;