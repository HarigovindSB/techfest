import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

import Home from "./pages/Home";
import Events from "./pages/Events";
import Registration from "./pages/Registration";
import Confirmation from "./pages/Confirmation";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyRegistrations from "./pages/MyRegistrations";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

const Gallery = lazy(() => import("./pages/Gallery"));

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main>
        <Suspense fallback={<p className="loading page">Loading...</p>}>
          <Routes>
            {/* Public pages */}
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />

            {/* Regular user authentication */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/my-registrations"
              element={<MyRegistrations />}
            />

            {/* Administrator authentication */}
            <Route path="/admin-login" element={<AdminLogin />} />

            {/* Administrator-only pages */}
            <Route element={<ProtectedAdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            {/* Unknown routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </BrowserRouter>
  );
}