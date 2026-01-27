import type { ComponentType } from "react";

import * as GleichungenPage from "./pages/gleichungen.mdx";
import * as HomePage from "./pages/home.mdx";
import * as SchularbeitPage from "./pages/mathe-schularbeit-1.mdx";
import * as PotenzschreibweisePage from "./pages/potenzschreibweise.mdx";
import * as TermePage from "./pages/terme.mdx";

export interface Route {
  path: string;
  name: string;
  component: ComponentType;
  title: string;
  grade?: number;
  subject?: string;
}

type MDXPageModule = {
  default: ComponentType;
  title?: string;
  grade?: number;
  subject?: string;
};

const pages: { name: string; imp: MDXPageModule }[] = [
  {
    name: "potenzschreibweise",
    imp: PotenzschreibweisePage,
  },
  {
    name: "home",
    imp: HomePage,
  },
  {
    name: "terme",
    imp: TermePage,
  },
  {
    name: "gleichungen",
    imp: GleichungenPage,
  },
  {
    name: "schularbeit",
    imp: SchularbeitPage,
  },
];

export const routes: Route[] = pages.map((page) => ({
  component: page.imp.default,
  name: page.name,
  path: `/${page.name === "home" ? "" : page.name}`,
  title: page.imp.title || page.name,
  grade: page.imp.grade,
  subject: page.imp.subject,
}));

// Sort routes by title alphabetically
routes.sort((a, b) => a.title.localeCompare(b.title));

// Move home route to the beginning
const homeIndex = routes.findIndex((route) => route.name === "home");
if (homeIndex > -1) {
  const [homeRoute] = routes.splice(homeIndex, 1) as [Route];
  routes.unshift(homeRoute);
}
