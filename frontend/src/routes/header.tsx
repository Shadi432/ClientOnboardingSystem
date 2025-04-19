import { data, Link,NavLink, Outlet } from "react-router";
import { userData } from "../components/cookies";

export async function loader({request}: any) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = await userData.parse(cookieHeader) || {};

  return data({ userData: cookie.userData });
};

function App( { loaderData }: any) {
  return (
    <>
      <nav id="header">
          <h1>Client Onboarding System</h1>
          <NavLink to="login"> Login </NavLink>
          { loaderData.userData && <Link to="createUser"> Create User </Link>  }
      </nav>
      <Outlet />
    </>
  )
}

export default App
