import { Form } from "react-router";

const LOGIN_USER_URL =
    import.meta.env.MODE === "development"
    ? import.meta.env.VITE_DEVELOPMENT_LOGIN_USER_URL
    : import.meta.env.VITE_PRODUCTION_LOGIN_USER_URL;

// const updateState = (value) => {
//     console.log(value);
// };

function Login(){
    return(
        <>
            <Form action={LOGIN_USER_URL} method="post">                
                <span className="inputTitle"> Login </span>
                <input className="inputBox" name="username" type="text" placeholder="Enter Username"/>
                <input className="inputBox" name="password" type="text" placeholder="Enter Password"/>
                <button type="submit">Login</button>
            </Form>

        </>
    )
}

export default Login