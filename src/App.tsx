import { useState, useEffect, useRef, type ReactNode } from "react";
import { MDXProvider } from "@mdx-js/react";
import { routes, type Route } from "./routes";
import a4 from "./a4.css?url";
import a8 from "./a8.css?url";
import { AutoSizedText } from "./components/AutoSizedText.tsx";

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

  const mdxComponents = {
    Exercise: ({ children }: { children?: ReactNode }) => (
      <div className="exercise">{children}</div>
    ),
    MSFormsQuestion: ({ children }: { children?: ReactNode }) => (
      <div className="ms-forms-question">
        {children}
        <p>ANSWER: A</p>
      </div>
    ),
    Solution: ({ children }: { children?: ReactNode }) => (
      <span className="solution">{children}</span>
    ),
    Points: ({ children }: { children?: ReactNode }) => (
      <div className="points">{children}</div>
    ),
    Note: ({ children }: { children?: ReactNode }) => (
      <span className="note">{children}</span>
    ),
    Flashcard: ({
      front,
      children,
    }: {
      front: ReactNode;
      children?: ReactNode;
    }) => (
      <div className="flashcard">
        <div className="flashcard-front a8">
          <div className="flashcard-content">
            <AutoSizedText>{front}</AutoSizedText>
          </div>
        </div>
        <div className="flashcard-back a8">
          <div className="flashcard-content">
            <AutoSizedText>{children}</AutoSizedText>
          </div>
        </div>
      </div>
    ),
    Footer: ({ text }: { text: string }) => (
      <style>{`
  @page {
    @bottom-left {
      content: "${text}";
    }
  }
`}</style>
    ),
  };

  const PageComponent = currentRoute.component;

  return (
    <div ref={appRef} className="App">
      <nav className="navbar bg-base-100 shadow-sm print:hidden">
        <div className="max-w-4xl mx-auto flex w-full">
          <a className="btn btn-ghost text-xl" onClick={() => navigate("home")}>
            Ralph
          </a>
          <select
            className="select"
            value={currentRoute.name}
            onChange={(e) => navigate(e.target.value)}
          >
            {routes.map((route) => (
              <option key={route.name} value={route.name}>
                {route.title}
              </option>
            ))}
          </select>
          <div className="grow"></div>
          <details className="dropdown dropdown-end">
            <summary className="btn">?</summary>
            <ul className="menu dropdown-content bg-base-200 rounded-box m-1 z-1 w-100 p-2 shadow-sm">
              <li>
                Lies die Seite `{currentRoute.name}.mdx` sorgfältig durch.
              </li>
              <li>Verbessere in Seite `{currentRoute.name}.mdx` ...</li>
              <li>Erweitere die Seite `{currentRoute.name}.mdx` um ...</li>
            </ul>
          </details>
          <button
            onClick={toggleSolutions}
            className="btn solution-toggle ml-3"
          >
            Lösungen
          </button>
        </div>
      </nav>
      <div
        className={`max-w-4xl mx-auto px-8 format-${currentRoute.format || "base"}`}
      >
        <MDXProvider components={mdxComponents}>
          <div className="content">
            <div className="page-header text-3xl mt-6 mb-4">
              {currentRoute.title}
            </div>
            <PageComponent />
          </div>
        </MDXProvider>
      </div>
      <link
        rel="stylesheet"
        href={currentRoute.format == "lernkarten" ? a8 : a4}
      ></link>
    </div>
  );
}

export default App;
