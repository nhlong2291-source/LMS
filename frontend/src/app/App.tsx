import React from "react";
import { BrowserRouter } from "react-router-dom";
import RoutesRoot from "./routes";
import Providers from "./providers";

export default function App() {
  return (
    <Providers>
      <BrowserRouter>
        <RoutesRoot />
      </BrowserRouter>
    </Providers>
  );
}
