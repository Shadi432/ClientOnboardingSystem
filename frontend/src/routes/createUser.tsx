import { data, Form } from "react-router";
import { z } from "zod";

const userTypeEnum = z.enum(["Secretary", "Manager", "Admin", "MLRO"])

const requiredError = {
  required_error: "This is a required field",
}

const mySchema = z.object({
  // UserId optional to let this work for creating users too
  UserId: z.optional(z.number().int().positive()),
  Username: z.string(requiredError)
              .min(3, { message: "Username should be at least 3 characters long"})
              .max(50, { message: "Username should be less than 50 characters long"}),
  Pass: z.string(requiredError)
          .min(5, { message: "Password should be at least 5 characters long"})
          .max(80, { message: "Password should be less than 80 characters long"}),
  Email: z.string(requiredError)
          .email({ message: "Invalid email address"})
          .max(255, { message: "Email should be less than 255 characters long"}),
  UserType: userTypeEnum
});

export async function action({ request }: any){
  let formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");
  const email = formData.get("email");
  const userType = formData.get("userType");

  console.log(password)
  const userValidation = mySchema.safeParse({Username: username, Pass: password, Email: email, UserType: userType});
  if (!userValidation.success) {
    // Return message for use in error handling.
    return data(userValidation.error.errors[0]);
  }

  // On success: 

  // Hash the Password given

  // Submit to DB
  // Handle the error response if a duplicate username is submitted

  // Return response using data
}


function CreateUser( { actionData }: any){
  return(
    <>
      <Form action="" method="post">
        <span className="inputTitle">Create a New User </span>
        <input className="inputBox" name="username" type="text" placeholder="Enter Username"/>
        <input className="inputBox" name="password" type="text" placeholder="Enter Password"/>
        <input className="inputBox" name="email" type="text" placeholder="Enter Email"/>
        {/* Selct user role? Dropdown Menu */}
        <select id="userTypeDropdown" name="userType">
          <option value="Secretary">Secretary</option>
          <option value="Manager">Manager</option>
          <option value="MLRO">MLRO</option>
        </select>
        <button type="submit"> Create Account </button>
        { actionData && <p> { actionData.message }</p>}
      </Form>
    </>
  )
}

export default CreateUser;