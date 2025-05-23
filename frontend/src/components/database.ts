import tedious, { Connection, Request } from "tedious";
import {  ClientFormData, ClientFormDataValidator, User, userTypeEnum } from "./types";
import fs from "fs";

const IS_TESTING_MODE = import.meta.env.VITE_IS_TESTING_MODE || "false";


// For submission unless the examiner has a MSSQL Database installed locally they cannot run this.
// Therefore I've mocked out the database for the submission and will demonstrate with the real one.
const MOCK_LOGIN_DB = "LoginDetails.txt";
const MOCK_CLIENT_FORM_DB = "ClientForms.txt";
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


// MOCK Function
export function GetUser(username: string): Promise<User>{
  return new Promise((resolve) => {
    let user = {} as User;

    fs.readFile(MOCK_LOGIN_DB, (err, data) => {
      const dataList = data.toString().split("\n")

      for (const userDataIndex in dataList){
        if (dataList[userDataIndex].length > 0){
          const userData = dataList[userDataIndex];
          const columnsList = userData.split(",")

          for (const columnIndex in columnsList){
            if (username == columnsList[0]){
              switch (columnIndex){
                case "0":
                  user.Username = columnsList[columnIndex];
                  break;
                case "1":
                  user.Pass = columnsList[columnIndex];
                  break;
                case "2":
                  user.Email = columnsList[columnIndex];
                  break;
                case "3":
                  user.UserType = userTypeEnum.parse(columnsList[columnIndex]);
                  break;
              }
            }
          }
        }
      }
      resolve(user);
    });
  })
}


// export function GetUser(username: string): Promise<User>{
//   return new Promise((resolve) => {
//     const GET_USER_QUERY = `SELECT * FROM LoginDetails WHERE Username = '${username}'`;

//     let user = {} as User;

//     // DB Connection
//     let connection = new Connection(CONFIG);
//     let dbRequest = new Request(GET_USER_QUERY, function(err) {
//       if (err) {
//         console.log(err);
//       } else {
//         connection.close();        
//         resolve(user);
//       }
//     });

//     connection.on("connect", function(err){
//       if (err) {
//         console.log("Error: ", err);
//       }
//       connection.execSql(dbRequest);
//     });

//     dbRequest.on("row", function(columns) {
//       columns.forEach(function(column: any ){        
//         switch(column.metadata.colName){
//           case "UserId":
//             user.UserId = column.value;
//             break;
//           case "Username":
//             user.Username = column.value;
//             break;
//           case "Pass":
//             user.Pass = column.value;
//             break;
//           case "Email":
//             user.Email = column.value;
//             break;
//           case "UserType":
//             user.UserType = column.value;
//             break;
//         }
//       });
//     });

//     connection.connect();
//   });
// }

// MOCK Function
export function GetAllUsersByRole(role: string): Promise<User[]>{
  return new Promise((resolve) => {
    let userList: User[] = [];

    fs.readFile(MOCK_LOGIN_DB, (err, data) => {
      const dataList = data.toString().split("\n");
      

      for (const userDataIndex in dataList){
        if (dataList[userDataIndex].length > 0){
          const userData = dataList[userDataIndex];
          const columnsList = userData.split(",");

          let user = {} as User;

          if (role == columnsList[3]){
            for (const columnIndex in columnsList){
              switch (columnIndex){
                case "0":
                  user.Username = columnsList[columnIndex];
                  break;
                case "1":
                  user.Pass = columnsList[columnIndex];
                  break;
                case "2":
                  user.Email = columnsList[columnIndex];
                  break;
                case "3":
                  user.UserType = userTypeEnum.parse(columnsList[columnIndex]);
                  break;
              }
            }
            userList.push(user);
          }
        }
      }
      resolve(userList);
    })
  })
}

// export function GetAllUsersByRole(role: string): Promise<User[]>{
//   return new Promise((resolve) => {
//     const GET_USER_QUERY = `SELECT * FROM LoginDetails WHERE UserType = '${role}'`;

//     let userList: User[] = []
    

//     // DB Connection
//     let connection = new Connection(CONFIG);
//     let dbRequest = new Request(GET_USER_QUERY, function(err) {
//       if (err) {
//         console.log(err);
//       } else {
//         connection.close();        
//         resolve(userList);
//       }
//     });

//     connection.on("connect", function(err){
//       if (err) {
//         console.log("Error: ", err);
//       }
//       connection.execSql(dbRequest);
//     });

//     dbRequest.on("row", function(columns) {
//       let user = {} as User;
//       columns.forEach(function(column: any ){    

//         switch(column.metadata.colName){
//           case "UserId":
//             user.UserId = column.value;
//             break;
//           case "Username":
//             user.Username = column.value;
//             break;
//           case "Pass":
//             user.Pass = column.value;
//             break;
//           case "Email":
//             user.Email = column.value;
//             break;
//           case "UserType":
//             user.UserType = column.value;
//             break;
//         }
//       });
//       userList.push(user);
//     });

//     connection.connect();
//   });
// }

// Mock doesn't have duplicate name check
export function CreateUser(user: User): Promise<Error | null>{
  return new Promise((resolve) => {
    const userDataToSave = `${user.Username},${user.Pass},${user.Email},${user.UserType}\n`
    fs.appendFile(MOCK_LOGIN_DB, userDataToSave, (err) => {
      if (err) throw err;

      resolve(null);
    })
  })
}


// export function CreateUser(user: User): Promise<Error | null>{
//   return new Promise((resolve) => {
//     const CREATE_USER_QUERY = `INSERT INTO LoginDetails ("Username", "Pass", "Email", "UserType") VALUES ('${user.Username}', '${user.Pass}', '${user.Email}', '${user.UserType}');`;

//     // DB Connection
//     let connection = new Connection(CONFIG);
    
//     let dbRequest = new Request(CREATE_USER_QUERY, function(err) {
//       if (err) {
//         console.log(err);
//         resolve(err);
//       } else {
//         connection.close();
//         resolve(null);
//       }
//     });

//     connection.on("connect", function(err){
//       if (err) {
//         console.log("Error: ", err);
//       }
      
//       connection.execSql(dbRequest);
//     });

//     connection.connect();
//   });
// }

// MOCK Function
export async function GetAllClientFormsByOwner(owningUser: User){
  return new Promise((resolve) => {
    let clientFormList: ClientFormData[] = [];

    fs.readFile(MOCK_CLIENT_FORM_DB, (err, data) => {
      const dataList = data.toString().split("\n");

      for (const clientFormIndex in dataList){
        const clientForm = dataList[clientFormIndex];
        const columnsList = clientForm.split("/");

        let clientFormData = {} as ClientFormData;

        if (owningUser.Username == columnsList[1]){
          for (const columnIndex in columnsList){
            switch(columnIndex){
              case "0":
                clientFormData.ClientName = columnsList[columnIndex];
                break;
              case "1":
                clientFormData.Owner = columnsList[columnIndex];
                break;
              case "2":
                clientFormData.Status = ClientFormDataValidator.shape.Status.parse(columnsList[columnIndex]);
                break;
              case "3":
                clientFormData.PartnerApproved = columnsList[columnIndex];
                break;
              case "4":
                clientFormData.MLROApproved = columnsList[columnIndex];
                break;
              case "5":
                clientFormData.FormState = JSON.parse(columnsList[columnIndex]);
                break;
            }
          }
          clientFormList.push(clientFormData);
        }
      }
      resolve(clientFormList);
    });

  })
}


// export async function GetAllClientFormsByOwner(owningUser: User){
//   return new Promise((resolve => {
//     const GET_ALL_CLIENTS_QUERY = `SELECT * FROM ClientForms WHERE Owner = '${owningUser.Username}';`;

//     let clientFormList: any = []

//     let connection = new Connection(CONFIG);
//     let dbRequest = new Request(GET_ALL_CLIENTS_QUERY, function(err) {
//       if (err) {
//         console.log(err);
//       } else {
//         connection.close();        
//         resolve(clientFormList);
//       }
//     });

//     connection.on("connect", function(err){
//       if (err) {
//         console.log("Error: ", err);
//       }
//       connection.execSql(dbRequest);
//     });

//     dbRequest.on("row", function(columns) {
//       let clientData = {} as ClientFormData
//       columns.forEach(function(column: {metadata: {colName: string}, value: string} ){   
//         switch(column.metadata.colName){
//           case "ClientName":
//             clientData.ClientName = column.value;
//             break;
//           case "Owner":
//             if (owningUser.Username == column.value){
//               clientData.Owner = column.value;
//             } else {
//               clientData.Owner = "";
//               console.log("This user doesn't own this record.");
//             }
//             break;
//           case "Status":
//             const isValidStatusOption = ClientFormDataValidator.shape.Status.safeParse(column.value);
            
//             if (isValidStatusOption.success) {
//               clientData.Status = isValidStatusOption.data;
//             }
//             break;
//           case "PartnerApproved":
//             clientData.PartnerApproved = column.value;
//             break;
          
//           case "MLROApproved":
//             clientData.MLROApproved = column.value;
//             break;
//           case "FormState":
//             const formState = JSON.parse(column.value);
//             const isValidFormState = ClientFormDataValidator.shape.FormState.safeParse(formState);
//             if (isValidFormState.success){
//               clientData.FormState = formState;
//             }
//             break;
//         }
//       });
//       clientFormList.push(clientData);
//     });
//     connection.connect();
//   }));
// }

// MOCK Function
export async function GetClientFormByName(clientName: string){
  return new Promise((resolve) => {

    let clientData = {} as ClientFormData;

    fs.readFile(MOCK_CLIENT_FORM_DB, (err, data) => {
      const dataList = data.toString().split("\n");

      for (const clientFormIndex in dataList){
        if (dataList[clientFormIndex].length > 0){
          const clientForm = dataList[clientFormIndex];
          const columnsList = clientForm.split("/");

          for (const columnIndex in columnsList){
            switch (columnIndex){
              case "0":
                clientData.ClientName = columnsList[columnIndex];
                break;
              case "1":
                clientData.Owner = columnsList[columnIndex];
                break;
              case "2":
                clientData.Status = ClientFormDataValidator.shape.Status.parse(columnsList[columnIndex]);
                break;
              case "3":
                clientData.PartnerApproved = columnsList[columnIndex];
                break;
              case "4":
                clientData.MLROApproved = columnsList[columnIndex];
                break;
              case "5":
                clientData.FormState = JSON.parse(columnsList[columnIndex]);
                break;
            }
          }
        }
      }
      resolve(clientData);
    });
  })
}

// export async function GetClientFormByName(clientName: string){
//   return new Promise((resolve) => {
//     const GET_CLIENT_DATA_QUERY = `SELECT * FROM ClientForms WHERE ClientName = '${clientName}';`;

//     let clientData = {} as ClientFormData;

//     // DB Connection
//     let connection = new Connection(CONFIG);
//     let dbRequest = new Request(GET_CLIENT_DATA_QUERY, function(err) {
//       if (err) {
//         console.log(err);
//       } else {
//         connection.close();        
//         resolve(clientData);
//       }
//     });

//     connection.on("connect", function(err){
//       if (err) {
//         console.log("Error: ", err);
//       }
//       connection.execSql(dbRequest);
//     });

//     dbRequest.on("row", function(columns) {
//       columns.forEach(function(column: {metadata: {colName: string}, value: string} ){   
//         switch(column.metadata.colName){
//           case "ClientName":
//             clientData.ClientName = column.value;
//             break;
//           case "Owner":
//             clientData.Owner = column.value;
//             break;
//           case "Status":
//             const isValidStatusOption = ClientFormDataValidator.shape.Status.safeParse(column.value);
            
//             if (isValidStatusOption.success) {
//               clientData.Status = isValidStatusOption.data;
//             }
//             break;
//           case "PartnerApproved":
//             clientData.PartnerApproved = column.value
//             break;
            
//           case "MLROApproved":
//             clientData.MLROApproved = column.value
//             break;

//           case "FormState":
//             const formState = JSON.parse(column.value);
//             clientData.FormState = formState;
//             break;
//         }
//       });
//     });

//     connection.connect();
//   });
// }

// MOCK Function
async function GetFormsToApprove(approverName: string){
  return new Promise((resolve) => {
    let clientFormList: ClientFormData[] = [];

    fs.readFile(MOCK_CLIENT_FORM_DB, (err, data) => {
      const dataList = data.toString().split("\n");

      for (const clientFormIndex in dataList){
        const clientForm = dataList[clientFormIndex];
        const columnsList = clientForm.split("/");

        let clientFormData = {} as ClientFormData;
        const formState = ClientFormDataValidator.shape.FormState.parse(columnsList[5])

        for (const columnIndex in columnsList){
          switch(columnIndex){
            case "0":
              clientFormData.ClientName = columnsList[columnIndex];
              break;
            case "1":
              clientFormData.Owner = columnsList[columnIndex];
              break;
            case "2":
              clientFormData.Status = ClientFormDataValidator.shape.Status.parse(columnsList[columnIndex]);
              break;
            case "3":
              clientFormData.PartnerApproved = columnsList[columnIndex];
              break;
            case "4":
              clientFormData.MLROApproved = columnsList[columnIndex];
              break;
            case "5":
              clientFormData.FormState = JSON.parse(columnsList[columnIndex]);
              break;
          }
        }

        if (formState["PartnerToApprove"] && formState["PartnerToApprove"] == approverName && columnsList[3] == "false"){
          clientFormList.push(clientFormData);
        } else if (formState["MLROToApprove"] && formState["MLROToApprove"] == approverName && columnsList[4] == "false"){
          clientFormList.push(clientFormData);
        }
      }
    });    
  })
}

// export async function GetFormsToApprove(approverName: string){
//   return new Promise((resolve) => {
//     const GET_CLIENT_DATA_QUERY = `SELECT * FROM ClientForms WHERE Status = 'Pending Review';`;

//     let clientFormList: ClientFormData[] = [];

//     // DB Connection
//     let connection = new Connection(CONFIG);
//     let dbRequest = new Request(GET_CLIENT_DATA_QUERY, function(err) {
//       if (err) {
//         console.log(err);
//       } else {
//         connection.close();        
//         resolve(clientFormList);
//       }
//     });

//     connection.on("connect", function(err){
//       if (err) {
//         console.log("Error: ", err);
//       }
//       connection.execSql(dbRequest);
//     });

//     dbRequest.on("row", function(columns) {
//       let clientData = {} as ClientFormData;

//       columns.forEach(function(column: {metadata: {colName: string}, value: string} ){   
//         switch(column.metadata.colName){
//           case "ClientName":
//             clientData.ClientName = column.value;
//             break;
//           case "Owner":
//             clientData.Owner = column.value;
//             break;
//           case "Status":
//             const isValidStatusOption = ClientFormDataValidator.shape.Status.safeParse(column.value);
            
//             if (isValidStatusOption.success) {
//               clientData.Status = isValidStatusOption.data;
//             }
//             break;
//           case "PartnerApproved":
//             clientData.PartnerApproved = column.value;
//             break;
            
//           case "MLROApproved":
//             clientData.MLROApproved = column.value;
//             break;

//           case "FormState":
//             const formState = JSON.parse(column.value);
//             clientData.FormState = formState;
//             break;
//         }
//       });
      
//       if (clientData.FormState["PartnerToApprove"] && clientData.FormState["PartnerToApprove"] == approverName && clientData.PartnerApproved == "false"){
//         clientFormList.push(clientData);
//       } else if (clientData.FormState["MLROToApprove"] && clientData.FormState["MLROToApprove"] == approverName && clientData.MLROApproved == "false"){
//         clientFormList.push(clientData);
//       }
//     });

//     connection.connect();
//   });
// }

// MOCK Function
export async function CreateNewClient(formState: ClientFormData){
  return new Promise((resolve) => {
    const clientDataToSave = `${formState.ClientName}/${formState.Owner}/${formState.Status}/${formState.PartnerApproved}/${formState.MLROApproved}/${JSON.stringify(formState.FormState)}\n`

    fs.appendFile(MOCK_CLIENT_FORM_DB, clientDataToSave, (err) => {
      if (err) throw err;
    })

    resolve(null)
  })
}

// export async function CreateNewClient(formState: ClientFormData){
//   return new Promise((resolve) => {
//     const CREATE_CLIENT_QUERY = `DELETE FROM ClientForms WHERE ClientName = '${formState.ClientName}'; INSERT INTO ClientForms ("ClientName", "Owner", "Status", "PartnerApproved", "MLROApproved", "FormState") VALUES ('${formState.ClientName}', '${formState.Owner}', '${formState.Status}', '${formState.PartnerApproved}', '${formState.MLROApproved}', '${JSON.stringify(formState.FormState)}');`;

//     // DB Connection
//     let connection = new Connection(CONFIG);
    
//     let dbRequest = new Request(CREATE_CLIENT_QUERY, function(err) {
//       if (err) {
//         console.log(`Error: ${err}`);
//         resolve(err);
//       } else {
//         connection.close();
//         resolve(null);
//       }
//     });

//     connection.on("connect", function(err){
//       if (err) {
//         console.log("Error: ", err);
//       }
      
//       connection.execSql(dbRequest);
//     });

//     connection.connect();
//   });
// }