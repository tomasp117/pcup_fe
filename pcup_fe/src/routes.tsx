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

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "draws-editor", element: <Draws /> },
      { path: "time-table", element: <TimeTable /> },
      {
        path: "match-report",
        element: (
          <MatchProvider>
            <MatchReport />
          </MatchProvider>
        ),
      },
      {
        path: "time-table-editor",
        element: <PlayoffBracketEditor />,
      },
      {
        path: "my-team",
        element: <MyTeam />,
      },
    ],
  },
]);
