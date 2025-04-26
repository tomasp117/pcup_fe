import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import { Draws } from "./pages/Draws";
import { MatchReport } from "./pages/MatchReport";
import { TimeTable } from "./pages/TimeTable";
import { MatchProvider } from "./Contexts/MatchReportContext/MatchContext";
import { PlayoffBracketEditor } from "./components/Timetable/PlayoffBracketEditor";
import { ErrorPage } from "./pages/ErrorPage";
import { MyTeam } from "./pages/MyTeam";
import { CategoryPage } from "./pages/CategoryPage";
import { ProtectedRoute } from "./ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "draws-editor",
        element: (
          <ProtectedRoute allowedRoles={["Admin"]}>
            <Draws />
          </ProtectedRoute>
        ),
      },
      { path: "time-table", element: <TimeTable /> },
      {
        path: "match-report",
        element: (
          <ProtectedRoute allowedRoles={["Recorder", "Admin"]}>
            <MatchProvider>
              <MatchReport />
            </MatchProvider>
          </ProtectedRoute>
        ),
      },
      {
        path: "time-table-editor",
        element: (
          <ProtectedRoute allowedRoles={["Admin"]}>
            <TimeTable />
          </ProtectedRoute>
        ),
      },
      {
        path: "my-team",
        element: (
          <ProtectedRoute allowedRoles={["Coach", "Admin"]}>
            <MyTeam />
          </ProtectedRoute>
        ),
      },
      {
        path: "kategorie/:id",
        element: <CategoryPage />,
      },
    ],
  },
]);
