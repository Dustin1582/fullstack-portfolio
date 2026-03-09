import { Routes, Route, Navigate, Link } from "react-router-dom";
import InventoryApp from "./inventory-dashboard/InventoryApp.jsx";
import MovieApp from "./moviedb/MovieApp.jsx";
import { AuthProvider } from './inventory-dashboard/context/AuthContext.jsx'
import HubHome from "./pages/HubHome.jsx";
import Resume from "./pages/Resume.jsx";
import { MovieProvider } from "./moviedb/context/MovieContext.jsx";
import { FilterProvider } from "./moviedb/context/FilterContext.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HubHome />} />
      <Route path="/resume" element={<Resume />} />

        <Route path="/inventory/*" element={
          <AuthProvider>
              <InventoryApp />
          </AuthProvider>
        } />

        <Route path="/movie/*" element={
          <MovieProvider>
            <FilterProvider>
              <MovieApp />
            </FilterProvider>
          </MovieProvider>
          } />

      <Route path="*" element={<Navigate to="/" replace={true} />} />
    </Routes>
  );
};

export default App;
