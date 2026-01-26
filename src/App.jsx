import { useState, useEffect, useRef } from "react";
import { MDXProvider } from "@mdx-js/react";
import HomePage from "./pages/Home.mdx";
import PotenzschreibweisePage from "./pages/potenzschreibweise/index.mdx";
import TermePage from "./pages/terme/index.mdx";
import GleichungenPage from "./pages/gleichungen/index.mdx";
import SchularbeitPage from "./pages/schularbeit/index.mdx";

// Define available routes
export const routes = [
  { path: "/", name: "home", component: HomePage, title: "Home" },
  {
    path: "/potenzschreibweise",
    name: "potenzschreibweise",
    component: PotenzschreibweisePage,
    title: "Potenzschreibweise",
  },
  {
    path: "/terme",
    name: "terme",
    component: TermePage,
    title: "Terme",
  },
  {
    path: "/gleichungen",
    name: "gleichungen",
    component: GleichungenPage,
    title: "Gleichungen",
  },
  {
    path: "/schularbeit",
    name: "schularbeit",
    component: SchularbeitPage,
    title: "Schularbeit",
  },
];

// Helper to get route from pathname
function getRouteFromPath(pathname, basePath = "/ralph/") {
  // Remove base path and trailing slash
  let path = pathname.replace(basePath, "/").replace(/\/$/, "") || "/";
  // Handle index.html
  if (path.endsWith("/index.html")) {
    path = path.replace("/index.html", "") || "/";
  }
  return routes.find((r) => r.path === path) || routes[0];
}

const components = {
  h1: (props) => <h1 className="text-slate-800" {...props} />,
  h2: (props) => <h2 className="text-slate-700" {...props} />,
};

function App({ serverUrl }) {
  // Determine initial route from server URL or browser location
  const getInitialRoute = () => {
    if (serverUrl) {
      return getRouteFromPath(serverUrl);
    }
    if (typeof window !== "undefined") {
      return getRouteFromPath(window.location.pathname);
    }
    return routes[0];
  };

  const [currentRoute, setCurrentRoute] = useState(getInitialRoute);
  const appRef = useRef(null);

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
  const navigate = (routeName) => {
    const route = routes.find((r) => r.name === routeName) || routes[0];
    setCurrentRoute(route);
    if (typeof window !== "undefined") {
      const newUrl = `/ralph${route.path === "/" ? "/" : route.path + "/"}`;
      window.history.pushState({}, "", newUrl);
      window.scrollTo(0, 0);
    }
  };

  // Make navigation available to MDX pages
  const mdxComponents = {
    ...components,
    Exercise: ({ children }) => <div className="exercise">{children}</div>,
    Solution: ({ children }) => <span className="solution">{children}</span>,
    Points: ({ children }) => <div className="points">{children}</div>,
    Note: ({ children }) => <span className="note">{children}</span>,
    Footer: ({ text }) => (
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
          <a class="btn btn-ghost text-xl" onClick={() => navigate("home")}>
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
          <div className="flex-grow"></div>
          <button onClick={toggleSolutions} className="solution-toggle btn">
            Lösungen ein-/ausblenden
          </button>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-8">
        <MDXProvider components={mdxComponents}>
          <div className="content">
            <PageComponent />
          </div>
        </MDXProvider>
      </div>
    </div>
  );
}

export default App;
