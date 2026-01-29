import { createContext } from "react";
import type { Route } from "./routes.ts";

export const RouteContext = createContext<Omit<Route, "component">>({
  name: "",
  path: "",
  title: "",
  format: undefined,
  grade: undefined,
  subject: undefined,
});
