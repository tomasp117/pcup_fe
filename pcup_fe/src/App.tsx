import { useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
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

const MatchLayout = () => (
  <MatchProvider>
    <Outlet />
  </MatchProvider>
);

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <UserProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/draws" element={<Draws />} />
              <Route path="/time-table" element={<TimeTable />} />
              <Route path="/match_report" element={<MatchLayout />}>
                <Route index element={<MatchReport />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </UserProvider>
    </>
  );
}

export default App;
