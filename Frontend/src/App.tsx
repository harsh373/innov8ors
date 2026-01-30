import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import ReportPrice from "./pages/ReportPrice";
import Result from "./pages/Result";
import History from "./pages/History";
import Profile from "./pages/Profile";        // ADD THIS
import Notifications from "./pages/Notifications";  // ADD THIS
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full">
      <SignedOut>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </SignedOut>

      <SignedIn>
        <main className="flex-1 w-full">
          <Routes>
            <Route path="/onboarding" element={<Onboarding />} />
            
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/report-price"
              element={
                <ProtectedRoute>
                  <ReportPrice />
                </ProtectedRoute>
              }
            />
            <Route
              path="/result"
              element={
                <ProtectedRoute>
                  <Result />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
            {/* ADD THESE TWO ROUTES ⬇️ */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />
            
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
      </SignedIn>
    </div>
  );
}

export default App;