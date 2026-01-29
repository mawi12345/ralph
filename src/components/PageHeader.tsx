import { useContext } from "react";
import { RouteContext } from "../RouteContext.ts";

export function PageHeader() {
  const route = useContext(RouteContext);

  return (
    <div
      className="page-header text-3xl mt-6 mb-4 cursor-copy"
      onClick={() => {
        navigator.clipboard.writeText(`Seite ${route.name}.mdx`);
      }}
    >
      {route.title}
    </div>
  );
}
