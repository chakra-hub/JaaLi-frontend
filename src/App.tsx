import { BrowserRouter, Routes, Route } from "react-router-dom";
import Streams from "./pages/Streams.tsx";
import PrivateRoute from "./components/PrivateRoute.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import PublicRoute from "./components/PublicRoute.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Streams />
            </PrivateRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
