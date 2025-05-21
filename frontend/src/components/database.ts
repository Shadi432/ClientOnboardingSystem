import tedious, { Connection, Request } from "tedious";
import {  ClientFormData, ClientFormDataValidator, User } from "./types";
import { z }from "zod";


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

export function GetAllUsersByRole(role: string): Promise<User[]>{
  return new Promise((resolve) => {
    const GET_USER_QUERY = `SELECT * FROM LoginDetails WHERE UserType = '${role}'`;

    let userList: User[] = []
    

    // DB Connection
    let connection = new Connection(CONFIG);
    let dbRequest = new Request(GET_USER_QUERY, function(err) {
      if (err) {
        console.log(err);
      } else {
        connection.close();        
        resolve(userList);
      }
    });

    connection.on("connect", function(err){
      if (err) {
        console.log("Error: ", err);
      }
      connection.execSql(dbRequest);
    });

    dbRequest.on("row", function(columns) {
      let user = {} as User;
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
      userList.push(user);
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

export async function GetAllClientFormsByOwner(owningUser: User){
  return new Promise((resolve => {
    const GET_ALL_CLIENTS_QUERY = `SELECT * FROM ClientForms WHERE Owner = '${owningUser.Username}';`;

    let clientFormList: any = []

    let connection = new Connection(CONFIG);
    let dbRequest = new Request(GET_ALL_CLIENTS_QUERY, function(err) {
      if (err) {
        console.log(err);
      } else {
        connection.close();        
        resolve(clientFormList);
      }
    });

    connection.on("connect", function(err){
      if (err) {
        console.log("Error: ", err);
      }
      connection.execSql(dbRequest);
    });

    dbRequest.on("row", function(columns) {
      let clientData = {} as ClientFormData
      columns.forEach(function(column: {metadata: {colName: string}, value: string} ){   
        switch(column.metadata.colName){
          case "ClientName":
            clientData.ClientName = column.value;
            break;
          case "Owner":
            if (owningUser.Username == column.value){
              clientData.Owner = column.value;
            } else {
              clientData.Owner = "";
              console.log("This user doesn't own this record.");
            }
            break;
          case "Status":
            const isValidStatusOption = ClientFormDataValidator.shape.Status.safeParse(column.value);
            
            if (isValidStatusOption.success) {
              clientData.Status = isValidStatusOption.data;
            }
            break;
          case "PartnerToApprove":
            clientData.PartnerToApprove = column.value;
            break;
          
          case "MLROToApprove":
            clientData.MLROToApprove = column.value;
            break;

          case "PartnerApproved":

            clientData.PartnerApproved = z.coerce.boolean().parse(column.value);
            break;
          
          case "MLROApproved":
            clientData.MLROApproved = z.coerce.boolean().parse(column.value);
            break;
          case "FormState":
            const formState = JSON.parse(column.value);
            const isValidFormState = ClientFormDataValidator.shape.FormState.safeParse(formState);
            if (isValidFormState.success){
              clientData.FormState = formState;
            }
            break;
        }
      });
      clientFormList.push(clientData);
    });
    connection.connect();
  }));
}

export async function GetClientFormByName(clientName: string, owningUser: User){
  return new Promise((resolve) => {
    const GET_CLIENT_DATA_QUERY = `SELECT * FROM ClientForms WHERE ClientName = '${clientName}';`;

    let clientData = {} as ClientFormData;

    // DB Connection
    let connection = new Connection(CONFIG);
    let dbRequest = new Request(GET_CLIENT_DATA_QUERY, function(err) {
      if (err) {
        console.log(err);
      } else {
        connection.close();        
        resolve(clientData);
      }
    });

    connection.on("connect", function(err){
      if (err) {
        console.log("Error: ", err);
      }
      connection.execSql(dbRequest);
    });

    dbRequest.on("row", function(columns) {
      columns.forEach(function(column: {metadata: {colName: string}, value: string} ){   
        switch(column.metadata.colName){
          case "ClientName":
            clientData.ClientName = column.value;
            break;
          case "Owner":
            if (owningUser.Username == column.value){
              clientData.Owner = column.value;
            } else {
              clientData.Owner = "";
              console.log("This user doesn't own this record.");
            }
            break;
          case "Status":
            const isValidStatusOption = ClientFormDataValidator.shape.Status.safeParse(column.value);
            
            if (isValidStatusOption.success) {
              clientData.Status = isValidStatusOption.data;
            }
            break;
          case "PartnerToApprove":
            clientData.PartnerToApprove = column.value;
            break;
          
          case "MLROToApprove":
            clientData.MLROToApprove = column.value;
            break;

          case "PartnerApproved":
            clientData.PartnerApproved = z.coerce.boolean().parse(column.value);
            break;
            
          case "MLROApproved":
            clientData.MLROApproved = z.coerce.boolean().parse(column.value);
            break;

          case "FormState":
            const formState = JSON.parse(column.value);
            clientData.FormState = formState;
            break;
        }
      });
    });

    connection.connect();
  });
}

export async function CreateNewClient(formState: any){
  return new Promise((resolve) => {
    const CREATE_CLIENT_QUERY = `DELETE FROM ClientForms WHERE ClientName = '${formState.ClientName}'; INSERT INTO ClientForms ("ClientName", "Owner", "Status", "PartnerToApprove", "MLROToApprove", "PartnerApproved", "MLROApproved", "FormState") VALUES ('${formState.ClientName}', '${formState.Owner}', '${formState.Status}', '${formState.PartnerToApprove}', '${formState.MLROToApprove}', '${formState.PartnerApproved}', '${formState.MLROApproved}', '${JSON.stringify(formState.FormState)}');`;

    // DB Connection
    let connection = new Connection(CONFIG);
    
    let dbRequest = new Request(CREATE_CLIENT_QUERY, function(err) {
      if (err) {
        console.log(`Error: ${err}`);
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