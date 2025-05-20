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
    route("onboardForm", "./routes/onboardForm/formParent.tsx", [
      route(":clientName?/page1", "./routes/onboardForm/page1.tsx"),
      route(":clientName?/page2", "./routes/onboardForm/page2.tsx"),
      route(":clientName?/page3", "./routes/onboardForm/page3.tsx"),
      route(":clientName?/page4", "./routes/onboardForm/page4.tsx"),
    ]),
  ]),
  route("authFail", "./routes/UnauthenticatedUser.tsx"),
] satisfies RouteConfig;
