import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { createMalloyRouter } from "./App";

// Main.tsx is used to run the app locally. This is not used when the app is
// embedded in another project.
const server = `${window.location.protocol}//${window.location.host}/api/v0`;
const router = createMalloyRouter("/", undefined, server);

ReactDOM.createRoot(document.getElementById("root")!).render(
   <React.StrictMode>
      <RouterProvider router={router} />
   </React.StrictMode>,
);
