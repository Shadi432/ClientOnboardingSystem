import { Form } from "react-router";

export async function action({ request }: any){
  let formData = await request.formData();
  console.log(formData);
  // ZOD Data Validation

  // Hash the Password

  // Submit to DB
  // Handle the error response if a duplicate username is submitted

  // Return response using data
}


function CreateUser(){
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
      </Form>
    </>
  )
}

export default CreateUser;