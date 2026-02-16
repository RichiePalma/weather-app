import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { Search } from "./pages/Search";
import { Favorites } from "./pages/Favorites";
import { Map } from "./pages/Map";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/search",
    Component: Search,
  },
  {
    path: "/favorites",
    Component: Favorites,
  },
  {
    path: "/map",
    Component: Map,
  },
  {
    path: "*",
    Component: () => {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl mb-4">404</h1>
            <p className="text-muted-foreground">Page not found</p>
          </div>
        </div>
      );
    },
  },
]);
