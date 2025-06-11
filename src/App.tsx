
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Gallery from "./pages/Gallery";
import Reservations from "./pages/Reservations";
import PreOrder from "./pages/PreOrder";
import Orders from "./pages/Orders";
import Contact from "./pages/Contact";
import Feedback from "./pages/Feedback";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ChefPanel from "./pages/admin/ChefPanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes with Layout */}
            <Route path="/" element={
              <Layout>
                <Home />
              </Layout>
            } />
            <Route path="/menu" element={
              <Layout>
                <Menu />
              </Layout>
            } />
            <Route path="/gallery" element={
              <Layout>
                <Gallery />
              </Layout>
            } />
            <Route path="/reservations" element={
              <Layout>
                <Reservations />
              </Layout>
            } />
            <Route path="/pre-order" element={
              <Layout>
                <PreOrder />
              </Layout>
            } />
            <Route path="/orders" element={
              <Layout>
                <Orders />
              </Layout>
            } />
            <Route path="/contact" element={
              <Layout>
                <Contact />
              </Layout>
            } />
            <Route path="/feedback" element={
              <Layout>
                <Feedback />
              </Layout>
            } />

            {/* Admin Routes - No Layout */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/chef" element={
              <ProtectedRoute allowedRoles={['chef']}>
                <ChefPanel />
              </ProtectedRoute>
            } />

            {/* Catch-all route */}
            <Route path="*" element={
              <Layout>
                <NotFound />
              </Layout>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
