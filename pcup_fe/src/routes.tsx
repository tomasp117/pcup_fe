import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import { Draws } from "./pages/Draws";
import { TimeTable } from "./pages/TimeTable";
import { ErrorPage } from "./pages/ErrorPage";
import { MyTeam } from "./pages/MyTeam";
import { CategoryPage } from "./pages/CategoryPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { MatchSelectorPage } from "./pages/MatchSelectorPage";
import { MatchReportPage } from "./pages/MatchReportPage";
import { TeamPage } from "./pages/TeamPage";
import { CreateTournamentWizard } from "./components/CreateTournamentWizard";
import { EditTournamentForm } from "./pages/EditTournamentForm";
import { EditTournamentInstanceForm } from "./pages/EditTournamentInstanceForm";
import { EditCategoryForm } from "./pages/EditCategoryForm";
import { EditClubForm } from "./pages/EditClubForm";
import { MatchPreviewPage } from "./pages/MatchPreviewPage";
import { fetchMatch } from "./hooks/useMatches";

const API_URL = import.meta.env.VITE_API_URL;

export const router = createBrowserRouter([
  {
    path: "/:edition?",
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
            <MatchReportPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "match-preview/:id",

        element: <MatchPreviewPage />,
      },
      {
        path: "teams/:id",
        element: <TeamPage />,
      },
      {
        path: "create-tournament-full",
        element: (
          <ProtectedRoute allowedRoles={["Admin"]}>
            <CreateTournamentWizard />
          </ProtectedRoute>
        ),
      },
      {
        path: "tournaments/:id/edit",
        element: (
          <ProtectedRoute allowedRoles={["Admin"]}>
            <EditTournamentForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "tournament-instances/:id/edit",
        element: (
          <ProtectedRoute allowedRoles={["Admin"]}>
            <EditTournamentInstanceForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "categories/:id/edit",
        element: (
          <ProtectedRoute allowedRoles={["Admin"]}>
            <EditCategoryForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "clubs/:id/edit",
        element: (
          <ProtectedRoute allowedRoles={["Admin"]}>
            <EditClubForm />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
