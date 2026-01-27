import { useState, useEffect, useRef, type ReactNode } from "react";
import { MDXProvider } from "@mdx-js/react";
import { routes, type Route } from "./routes";

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

interface MDXComponentProps {
  children?: ReactNode;
  [key: string]: unknown;
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
    Solution: ({ children }: { children?: ReactNode }) => (
      <span className="solution">{children}</span>
    ),
    Points: ({ children }: { children?: ReactNode }) => (
      <div className="points">{children}</div>
    ),
    Note: ({ children }: { children?: ReactNode }) => (
      <span className="note">{children}</span>
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
          <button onClick={toggleSolutions} className="solution-toggle btn">
            Lösungen ein-/ausblenden
          </button>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-8">
        <MDXProvider components={mdxComponents}>
          <div className="content">
            <div className="page-header text-3xl mt-6 mb-4">
              {currentRoute.title}
            </div>
            <PageComponent />
          </div>
        </MDXProvider>
      </div>
    </div>
  );
}

export default App;
