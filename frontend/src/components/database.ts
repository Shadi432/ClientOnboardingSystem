import tedious, { Connection, Request } from "tedious";
import {  User } from "./types";


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


export function GetUser(username: string): Promise<User>{
  return new Promise((resolve) => {
    const GET_USER_QUERY = `SELECT * FROM LoginDetails WHERE Username = '${username}'`;

    let user = {} as User;

    // DB Connection
    let connection = new Connection(CONFIG);
    let dbRequest = new Request(GET_USER_QUERY, function(err) {
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
        }
      });
    });

    connection.connect();
  });
}

export function CreateUser(user: User): Promise<Error | null>{
  return new Promise((resolve) => {
    
    const CREATE_USER_QUERY = `INSERT INTO LoginDetails ("Username", "Pass", "Email", "UserType") VALUES ('${user.Username}', '${user.Pass}', '${user.Email}', '${user.UserType}');`;

    // DB Connection
    let connection = new Connection(CONFIG);
    
    let dbRequest = new Request(CREATE_USER_QUERY, function(err) {
      if (err) {
        console.log(err);
        resolve(err);
      } else {
        connection.close();
        resolve(null);
      }
    });

    connection.on("connect", function(err){
      if (err) {
        console.log("Error: ", err);
      }
      
      connection.execSql(dbRequest);
    });

    connection.connect();
  });
}
