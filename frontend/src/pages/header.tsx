import { Outlet } from "react-router";
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

function GetUserFromDB(username: string){
  const GET_USER_QUERY = `SELECT * FROM LoginDetails WHERE Username = '${username}'`;

  let user: { [id: string]: string} = {};
  
  // DB Connection
  var connection = new Connection(CONFIG);
  let dbRequest = new tedious.Request(GET_USER_QUERY, function(err) {
    if (err) {
      console.log(err);
    } else {
      connection.close();
      // Need to convert user into a format that lets them be returned. Can't return dictionaries in javascript.
      console.log(user);
      return user;
    }
  });

  connection.on("connect", function(err){
    if (err) {
      console.log("Error: ", err);
    }
    connection.execSql(dbRequest);
  });

  dbRequest.on("row", function(columns) {
    columns.forEach(function(column: any ) {
      console.log(column.metadata.colName)
      user[column.metadata.colName] = column.value;
      // Want to pack this into an object. zod userobject
    });
  });

  connection.connect();
}

// LoginUser: Used for the login form
export async function action({request}: any){
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");
  let hashedPassword: string = "";

  // Hashing password
  try {
    hashedPassword = await bcrypt.hash(password, 10);
  } catch {
    console.log("Error");
  }

  // Want this to return a good representation of the user data.
  let userObj = GetUserFromDB(username);
  console.log(userObj);
  
  // We just need to match the username so we have a target then compare the passwords with bcrypt.compare
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
