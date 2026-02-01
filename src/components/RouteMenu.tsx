import { useContext } from "react";
import type { Route } from "../routes.ts";
import { RouteContext } from "../RouteContext.ts";

interface Props {
  routes: Route[];
  navigate: (routeName: string) => void;
}

type FolderNode = {
  kind: "folder";
  name: string;
  children: TreeNode[];
};

type RouteNode = {
  kind: "route";
  route: Route;
};

type TreeNode = FolderNode | RouteNode;

function getSubject({ subject }: { subject?: string }): string {
  return subject || "Allgemein";
}

function getGrade({ grade }: { grade?: number }): string {
  return grade === undefined ? "Alle Schulstufen" : `${grade}. Schulstufe`;
}

function buildRouteTree(routes: Route[]): TreeNode[] {
  const roots: TreeNode[] = [];

  const subjects = [
    ...new Set<string | undefined>(routes.map((r) => r.subject)).values(),
  ];
  subjects.sort();

  const grades = [
    ...new Set<number | undefined>(routes.map((r) => r.grade)).values(),
  ];
  grades.sort();

  for (const subject of subjects) {
    const subjectNode: TreeNode = {
      kind: "folder",
      name: getSubject({ subject }),
      children: [],
    };

    for (const grade of grades) {
      const gradeNode: TreeNode = {
        kind: "folder",
        name: getGrade({ grade }),
        children: [],
      };

      const filteredRoutes = routes.filter(
        (r) => r.subject === subject && r.grade === grade,
      );

      for (const route of filteredRoutes) {
        gradeNode.children.push({
          kind: "route",
          route,
        });
      }
      if (gradeNode.children.length > 0) {
        subjectNode.children.push(gradeNode);
      }
    }
    if (subjectNode.children.length > 0) {
      roots.push(subjectNode);
    }
  }
  return roots;
}

function FolderItem({ node }: { node: FolderNode }) {
  return (
    <details>
      <summary>{node.name}</summary>
      <ul>
        {node.children.map((child, index) => (
          <li key={index}>
            <TreeNodeItem node={child} />
          </li>
        ))}
      </ul>
    </details>
  );
}

function RouteItem({ node }: { node: RouteNode }) {
  const { navigate, route } = useContext(RouteContext);
  return (
    <a
      className={route.name === node.route.name ? "font-bold" : ""}
      onClick={() => navigate(node.route.name)}
    >
      {node.route.title}
    </a>
  );
}

function TreeNodeItem({ node }: { node: TreeNode }) {
  if (node.kind === "folder") {
    return <FolderItem node={node} />;
  } else {
    return <RouteItem node={node} />;
  }
}

export function RouteTree({ routes, navigate }: Props) {
  const { route } = useContext(RouteContext);
  const tree = buildRouteTree(routes);
  return (
    <>
      <button
        className="breadcrumbs text-sm btn"
        popoverTarget="main-page-menu"
        style={{ anchorName: "--main-page-menu-btn" }}
      >
        <ul>
          <li>{getSubject(route)}</li>
          <li>{getGrade(route)}</li>
          <li>{route.title}</li>
        </ul>
      </button>
      <ul
        className="dropdown menu w-120 rounded-box bg-base-100 shadow-md"
        popover="auto"
        id="main-page-menu"
        style={
          {
            positionAnchor: "--main-page-menu-btn",
          } /* as React.CSSProperties */
        }
      >
        {tree.map((child, index) => (
          <li key={index}>
            <TreeNodeItem node={child} />
          </li>
        ))}
      </ul>
    </>
  );
}

export function FlatRouteMenu({ routes, navigate }: Props) {
  const { route } = useContext(RouteContext);
  return (
    <select
      className="select"
      value={route.name}
      onChange={(e) => navigate(e.target.value)}
    >
      {routes.map((route) => (
        <option key={route.name} value={route.name}>
          {route.title}
        </option>
      ))}
    </select>
  );
}
