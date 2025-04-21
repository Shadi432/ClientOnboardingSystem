import tedious, { Connection, Request } from "tedious";
import { User } from "./types";

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

export function GetUserFromDB(username: String): Promise<User | null>{
  return new Promise((resolve) => {
    const GET_USER_QUERY = `SELECT * FROM LoginDetails WHERE Username = '${username}'`;

    let user = {} as User;

    // DB Connection
    let connection = new Connection(CONFIG);
    let dbRequest = new Request(GET_USER_QUERY, function(err) {
      if (err) {
        console.log(err);
        resolve(null);
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
