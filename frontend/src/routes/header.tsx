import { data, Link,NavLink, Outlet } from "react-router";
import { userData } from "../components/cookies";
import { UserValidator} from "../components/types";

export async function loader({request}: any) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = await userData.parse(cookieHeader) || {};
  
  const validator = UserValidator.safeParse(cookie.userData);
    
  if (validator.success){
    return data({ user: cookie.userData });
  } else {
    return data({ err: "User wasn't able to be logged in, an error occurred"});
  }
};

function App( { loaderData }: any) {
  return (
    <>
      <nav id="header">
          <h1>Client Onboarding System</h1>
          <NavLink to="login"> Login </NavLink>
          { loaderData.user && loaderData.user.UserType == "Admin" && <Link to="createUser"> Create User </Link> }
      </nav>
      <Outlet />
    </>
  )
}

export default App
