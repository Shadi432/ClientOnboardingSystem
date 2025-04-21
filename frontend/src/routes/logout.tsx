import { Logout } from "../components/authentication";
import { data } from "react-router";


export async function action( { request }: any){
  const headersList = await Logout(request);

  return data("loggedOut", {
    headers: [...headersList],
  })
}

