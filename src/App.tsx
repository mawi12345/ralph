import { useState, useEffect, useRef } from "react";
import { MDXProvider } from "@mdx-js/react";
import { routes, type Route } from "./routes";
import { Exercise } from "./components/Exercise.tsx";
import { MSFormsQuestion } from "./components/MSFormsQuestion.tsx";
import { Solution } from "./components/Solution.tsx";
import { Points } from "./components/Points.tsx";
import { Note } from "./components/Note.tsx";
import { Flashcard } from "./components/Flashcard.tsx";
import { Footer } from "./components/Footer.tsx";
import { headings } from "./components/Heading.tsx";

import a4 from "./a4.css?url";
import a8 from "./a8.css?url";
import { RouteContext } from "./RouteContext.ts";
import { PageHeader } from "./components/PageHeader.tsx";
import { RouteTree } from "./components/RouteMenu.tsx";
import { TestCoverPage } from "./components/TestCoverPage.tsx";

const mdxComponents = {
  ...headings,
  Exercise,
  MSFormsQuestion,
  Solution,
  Points,
  Note,
  Flashcard,
  Footer,
  TestCoverPage,
};

// Helper to get route from pathname
function getRouteFromPath(pathname: string, basePath = "/ralph/"): Route {
  // Remove base path and trailing slash
  let path = pathname.replace(basePath, "/").replace(/\/$/, "") || "/";
  // Handle index.html
  if (path.endsWith("/index.html")) {
    path = path.replace("/index.html", "") || "/";
  }
  return routes.find((r) => r.path === path) || (routes[0] as Route);
}

interface AppProps {
  serverUrl?: string;
}

function App({ serverUrl }: AppProps) {
  // Determine initial route from server URL or browser location
  const getInitialRoute = (): Route => {
    if (serverUrl) {
      return getRouteFromPath(serverUrl);
    }
    if (typeof window !== "undefined") {
      return getRouteFromPath(window.location.pathname);
    }
    return routes[0] as Route;
  };

  const [currentRoute, setCurrentRoute] = useState(getInitialRoute);
  const appRef = useRef<HTMLDivElement>(null);

  const toggleSolutions = () => {
    appRef.current?.classList.toggle("hide-solutions");
  };

  // Handle browser back/forward navigation
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePopState = () => {
      setCurrentRoute(getRouteFromPath(window.location.pathname));
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Navigate to a new route
  const navigate = (routeName: string) => {
    const route =
      routes.find((r) => r.name === routeName) || (routes[0] as Route);
    setCurrentRoute(route);
    if (typeof window !== "undefined") {
      const newUrl = `/ralph${route.path === "/" ? "/" : route.path + "/"}`;
      window.history.pushState({}, "", newUrl);
      window.scrollTo(0, 0);
    }
  };

  const PageComponent = currentRoute.component;

  return (
    <RouteContext value={{ route: currentRoute, navigate }}>
      <div ref={appRef} className="App">
        <nav className="navbar bg-base-100 shadow-sm print:hidden">
          <div className="max-w-4xl mx-auto flex w-full">
            <a
              className="btn btn-ghost text-xl"
              onClick={() => navigate("home")}
            >
              Ralph
            </a>
            <RouteTree routes={routes} navigate={navigate} />
            <div className="grow"></div>
            {currentRoute.format !== "lernkarten" && (
              <button
                onClick={toggleSolutions}
                className="btn solution-toggle ml-3"
              >
                Lösungen
              </button>
            )}
            {currentRoute.format === "lernkarten" && (
              <button
                onClick={() => {
                  // hide headings
                  document
                    .querySelectorAll("h1, h2, h3, h4, h5, h6")
                    .forEach((el) => {
                      el.classList.add("hidden");
                    });

                  const sides = document.getElementsByClassName("a8");
                  // Shuffle flashcards by randomly reordering their elements
                  for (let r = 0; r < 3; r++) {
                    for (let i = sides.length - 1; i > 0; i--) {
                      const j = Math.floor(Math.random() * (i + 1));
                      const parent = sides.item(i)!.parentNode;
                      if (parent) {
                        parent.insertBefore(sides.item(j)!, sides.item(i));
                      }
                    }
                  }
                }}
                className="btn ml-3"
              >
                Mischen
              </button>
            )}
          </div>
        </nav>
        <div
          className={`max-w-4xl mx-auto px-8 format-${currentRoute.format || "base"}`}
        >
          <MDXProvider components={mdxComponents}>
            <div className="content">
              <PageHeader />
              <PageComponent />
            </div>
          </MDXProvider>
        </div>
        <link
          rel="stylesheet"
          href={currentRoute.format == "lernkarten" ? a8 : a4}
        ></link>
      </div>
    </RouteContext>
  );
}

export default App;
