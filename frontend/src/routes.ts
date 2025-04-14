import {
  type RouteConfig,
  index,
  route,
} from "@react-router/dev/routes";

export default [
  route("/", "./pages/header.tsx", [
    index("./pages/login.tsx")
  ])
] satisfies RouteConfig;
