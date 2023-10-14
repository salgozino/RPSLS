import React from "react";
import ReactDOM from "react-dom/client";
// import "./index.css";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chains, wagmiConfig } from "./lib/wagmi";
import { WagmiConfig } from "wagmi";
import Layout from "./pages/Layout";
import { CssBaseline, ThemeProvider } from "@mui/material";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Game } from "./components/Game";
import { NewGame } from "./components/NewGame";
import ErrorPage from "./pages/ErrorPage";
import theme from "./lib/theme";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <NewGame />,
      },
      {
        path: "/game/:gameId",
        element: <Game />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} showRecentTransactions={true}>
        <ThemeProvider theme={theme}/>
        <CssBaseline />
        <RouterProvider router={router} />
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);
