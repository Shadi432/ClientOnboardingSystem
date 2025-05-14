import {
  type RouteConfig,
  route,
} from "@react-router/dev/routes";

export default [
  route("", "./routes/header.tsx", [
    route("login", "./routes/login.tsx"),
    route("createUser", "./routes/createUserMenu.tsx"),
    route("logout", "./routes/logout.tsx"),
    route("home", "./routes/home.tsx"),
    route("onboardForm/:clientName?", "./routes/onboardForm.tsx")
  ]),
  route("authFail", "./routes/UnauthenticatedUser.tsx"),
] satisfies RouteConfig;
