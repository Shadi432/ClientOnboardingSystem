import { expect, test, vi } from "vitest";
import { action } from "../routes/createUserMenu";

const mocks = vi.hoisted(() => {
  return {
    CreateUser: vi.fn(),
    hash: vi.fn(),
  }
});

vi.mock("../components/database.ts", () => {
  return {
    CreateUser: mocks.CreateUser
  }
})

vi.mock("bcryptjs", () => {
  return {
    default: {
      hash: mocks.hash
    }
  }
});


test("CreateUserValidationTests: HappyPath", async () => {
  const FORM_DATA: any = {
    username: "TestUserAccount",
    password: "Something",
    email: "Something@gmail.com",
    userType: "Secretary"
  }

  const requestMock = {
    "request": {
      "formData": async () => {
        return {
          "get": (field: string)=> FORM_DATA[field],
        }
      },
    }
  }

  vi.doUnmock("bcryptjs");
  mocks.CreateUser.mockReturnValueOnce(null);
  const result: any = await action(requestMock);

  expect(result.data.success).toBe(true);

  mocks.CreateUser.mockRestore();
});

test("CreateUserValidationTests: Duplicate Username", async () => {
  const FORM_DATA: any = {
    username: "TestUserAccount",
    password: "Something",
    email: "Something@gmail.com",
    userType: "Secretary"
  }

  const requestMock = {
    "request": {
      "formData": async () => {
        return {
          "get": (field: string)=> FORM_DATA[field],
        }
      },
    }
  }

  mocks.CreateUser.mockReturnValueOnce(new Error("Violation of UNIQUE KEY constraint"));
  const result: any = await action(requestMock);

  expect(result.data.err).toBe("This username already exists");

  mocks.CreateUser.mockRestore();
});

test("CreateUserValidationTests: EmptyUsernameField", async () => {
  const FORM_DATA: any = {
    username: "",
    password: "Something",
    email: "Something@gmail.com",
    userType: "Secretary"
  }

  const requestMock = {
    "request": {
      "formData": async () => {
        return {
          "get": (field: string)=> FORM_DATA[field],
        }
      },
    }
  }

  const result: any = await action(requestMock);
  expect(result.data.err).toBe("Username should be at least 3 characters long");
})

test("CreateUserValidationTests: Error Hashing Password", async () => {  
  const FORM_DATA: any = {
    username: "MockUsername",
    password: "Something",
    email: "Something@gmail.com",
    userType: "Secretary"
  }

  const requestMock = {
    "request": {
      "formData": async () => {
        return {
          "get": (field: string)=> FORM_DATA[field],
        }
      },
    }
  }

  mocks.hash.mockImplementation(()=>{throw "mock hash failed"});

  const result: any = await action(requestMock);

  expect(result.data.err).toBe("An unexpected error occurred, try again");
});