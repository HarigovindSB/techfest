import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

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

// Exp 5: load the Gallery (and its images) only when it is visited
const Gallery = lazy(() => import("./pages/Gallery"));

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main>
        <Suspense fallback={<p className="loading page">Loading...</p>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/my-registrations" element={<MyRegistrations />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </main>

      <Footer />
    </BrowserRouter>
  );
}
