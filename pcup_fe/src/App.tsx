import { useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import ColorTest from "./pages/ColorTest";
import { MainLayout } from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import { MatchReport } from "./pages/MatchReport";
import { MatchProvider } from "./Contexts/MatchReportContext/MatchContext";
import { UserProvider } from "./Contexts/UserContext";
import { Draws } from "./pages/Draws";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TimeTable } from "./pages/TimeTable";
import { router } from "./routes";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();
function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <ToastContainer position="top-right" autoClose={3000} />
          <RouterProvider router={router} />
        </UserProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}

export default App;
