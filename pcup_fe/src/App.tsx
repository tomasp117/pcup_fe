import { useEffect } from "react";
import "./App.css";
import { RouterProvider } from "react-router-dom";

import { UserProvider } from "./Contexts/UserContext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { router } from "./routes";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp;
    if (!exp) return true;

    const now = Math.floor(Date.now() / 1000);
    return exp < now;
  } catch {
    return true;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute - data considered fresh for this duration
      gcTime: 1000 * 60 * 5, // 5 minutes - cache garbage collection time
      retry: 1, // Retry failed requests once
      refetchOnWindowFocus: false, // Prevent refetch on tab switch
    },
    mutations: {
      retry: 0, // Don't retry failed mutations by default
    },
  },
});

function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && isTokenExpired(token)) {
      localStorage.removeItem("token");
    }
  }, []);
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
