import { createContext } from "react";
import type { Route } from "./routes.ts";

type Context = {
  route: Omit<Route, "component">;
  navigate: (routeName: string) => void;
};

export const RouteContext = createContext<Context>({
  route: {
    name: "",
    path: "",
    title: "",
    format: undefined,
    grade: undefined,
    subject: undefined,
  },
  navigate: () => {},
});
