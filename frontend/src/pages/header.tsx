import { Outlet } from "react-router"

// Used for the login form
export async function action({request}: any){
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");

  // Password needs to be hashed here etc...
  console.log(username + " " + password);
  return 10;
}

function App() {
  return (
    <>
        <h1 id="header">Client Onboarding System</h1>
        <Outlet />
    </>
  )
}

export default App
