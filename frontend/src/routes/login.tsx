import { data, Form } from "react-router";
import { userData } from "../components/cookies";
import bcrypt from "bcryptjs";
import tedious from "tedious";

const Connection = tedious.Connection;

const CONFIG: tedious.ConnectionConfiguration = {
  server: "MAHDI\\MSSQLSERVER01",
  options: {
    trustServerCertificate: true,
  },
  authentication: {
    type: "default",
    options: {
      "userName": "sa",
      "password": "examplePassword1",
    }
  }
};

type User = {
  UserId: number;
  Username: string;
  Pass: string;
  Email: string;
  UserType: string;
  RefreshToken: string;
}


function GetUserFromDB(username: string): Promise<User>{
  return new Promise((resolve) => {
    const GET_USER_QUERY = `SELECT * FROM LoginDetails WHERE Username = '${username}'`;

    let user = {} as User;

    // DB Connection
    let connection = new Connection(CONFIG);
    let dbRequest = new tedious.Request(GET_USER_QUERY, function(err) {
      if (err) {
        console.log(err);
      } else {
        connection.close();        
        resolve(user);
      }
    });

    connection.on("connect", function(err){
      if (err) {
        console.log("Error: ", err);
      }
      connection.execSql(dbRequest);
    });

    dbRequest.on("row", function(columns) {
      columns.forEach(function(column: any ){        
        switch(column.metadata.colName){
          case "UserId":
            user.UserId = column.value;
            break;
          case "Username":
            user.Username = column.value;
            break;
          case "Pass":
            user.Pass = column.value;
            break;
          case "Email":
            user.Email = column.value;
            break;
          case "UserType":
            user.UserType = column.value;
            break;
          case "RefreshToken":
            user.RefreshToken = column.value;
        }
      });
    });

    connection.connect();
  });
}



// LoginUser: Used for the login form
export async function action({request}: any) {
    const formData = await request.formData();
    const username = formData.get("username");
    const password = formData.get("password");
    
    // let hashedPassword: string = "";
    // // Hashing password
    // try {
    //   hashedPassword = await bcrypt.hash(password, 10);
    // } catch {
    //   console.log("Error");
    // }
  
    const user = await GetUserFromDB(username);
    
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
    } catch {
      console.log("Problems logging in");
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
            {actionData ? console.log(actionData) : <p>None</p>}
        </>
    )
}

export default Login