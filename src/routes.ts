import type { ComponentType } from "react";
import { pages } from "./pages";

export interface Route {
  path: string;
  name: string;
  component: ComponentType;
  title: string;
  grade?: number;
  subject?: string;
  format?: string;
}

export const routes: Route[] = pages.map((page) => ({
  component: page.imp.default,
  name: page.name,
  path: `/${page.name === "home" ? "" : page.name}`,
  title: page.imp.title || page.name,
  grade: page.imp.grade,
  subject: page.imp.subject,
  format: page.imp.format,
}));

// Sort routes by title alphabetically
routes.sort((a, b) => a.title.localeCompare(b.title));

// Move home route to the beginning
const homeIndex = routes.findIndex((route) => route.name === "home");
if (homeIndex > -1) {
  const [homeRoute] = routes.splice(homeIndex, 1) as [Route];
  routes.unshift(homeRoute);
}
