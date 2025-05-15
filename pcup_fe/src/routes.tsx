import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import { Draws } from "./pages/Draws";
import { TimeTable } from "./pages/TimeTable";
import { MatchProvider } from "./Contexts/MatchReportContext/MatchContext";
import { PlayoffBracketEditor } from "./components/Timetable/PlayoffBracketEditor";
import { ErrorPage } from "./pages/ErrorPage";
import { MyTeam } from "./pages/MyTeam";
import { CategoryPage } from "./pages/CategoryPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { MatchSelectorPage } from "./pages/MatchSelectorPage";
import { MatchReport } from "./pages/MatchReport";
import { MatchReportPage } from "./pages/MatchReportPage";
import { TeamPage } from "./pages/TeamPage";
import { TournamentForm } from "./pages/TournamentForm";
import { TournamentInstanceForm } from "./pages/TournamentInstanceForm";
import { CategoryForm } from "./pages/CategoryForm";
import { CreateTournamentWizard } from "./components/CreateTournamentWizard";

const API_URL = import.meta.env.VITE_API_URL;

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
      // {
      //   path: "match-report",
      //   element: (
      //     <ProtectedRoute allowedRoles={["Recorder", "Admin"]}>
      //       <MatchProvider>
      //         <MatchReport />
      //       </MatchProvider>
      //     </ProtectedRoute>
      //   ),
      // },
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
      {
        path: "match-report",
        element: (
          <ProtectedRoute allowedRoles={["Recorder", "Admin"]}>
            {/* <MatchProvider> */}
            <MatchSelectorPage />
            {/* </MatchProvider> */}
          </ProtectedRoute>
        ),
      },
      {
        path: "match-report/:id",
        loader: async ({ params }) => {
          const res = await fetch(`${API_URL}/matches/${params.id}`);
          if (!res.ok) throw new Response("Match not found", { status: 404 });
          return res.json();
        },
        element: (
          <ProtectedRoute allowedRoles={["Recorder", "Admin"]}>
            {/* <MatchProvider> */}
            <MatchReportPage />
            {/* </MatchProvider> */}
          </ProtectedRoute>
        ),
      },
      {
        path: "teams/:id",
        element: <TeamPage />,
      },
      // {
      //   path: "create-tournament",
      //   element: (
      //     <ProtectedRoute allowedRoles={["Admin"]}>
      //       <TournamentForm />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: "create-tournament-instance",
      //   element: (
      //     <ProtectedRoute allowedRoles={["Admin"]}>
      //       <TournamentInstanceForm />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: "create-category",
      //   element: (
      //     <ProtectedRoute allowedRoles={["Admin"]}>
      //       <CategoryForm />
      //     </ProtectedRoute>
      //   ),
      // },
      {
        path: "create-tournament-full",
        element: (
          <ProtectedRoute allowedRoles={["Admin"]}>
            <CreateTournamentWizard />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
