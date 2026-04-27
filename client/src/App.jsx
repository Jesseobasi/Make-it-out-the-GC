import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import EventPage from "./pages/EventPage.jsx";
import ResultsPage from "./pages/ResultsPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/event/:eventId" element={<EventPage />} />
      <Route path="/event/:eventId/results" element={<ResultsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

