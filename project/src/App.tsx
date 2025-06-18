import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Layout from './components/layout/Layout';
import AdminLayout from './components/admin/AdminLayout';
import LoadingScreen from './components/common/LoadingScreen';
import ScrollToTop from './components/utils/ScrollToTop';
import PrivateRoute from './components/routes/PrivateRoute';

// Legal Pages
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'));

// Lazy loaded pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const WorkshopPage = lazy(() => import('./pages/WorkshopPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const AuthSuccess = lazy(() => import('./pages/AuthSuccess'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'))
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const PaymentSuccessPage = lazy(() => import('./pages/PaymentSuccessPage'));
const MyOrdersPage = lazy(() => import('./pages/MyOrdersPage'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('./pages/admin/Products'));
const AdminWorkshops = lazy(() => import('./pages/admin/Workshops'));
const AdminWorkshopsRegistration = lazy(() => import('./pages/admin/WorkshopRegistrations'));
const AdminOrders = lazy(() => import('./pages/admin/Orders'));
const AdminUsers = lazy(() => import('./pages/admin/Users'));
const AdminSettings = lazy(() => import('./pages/admin/Settings'));
const AboutAdmin = lazy(() => import('./pages/admin/About'));
const AdminServices = lazy(() => import('./pages/admin/Services'));
const AdminCollaborators = lazy(() => import('./pages/admin/Collaborator'));

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <ScrollToTop />
      <Suspense fallback={<LoadingScreen />}>
        <Routes location={location} key={location.pathname}>
          {/* Public Routes with Layout (includes navbar) */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/:id" element={<ProductDetailPage />} />
            <Route path="workshops" element={<WorkshopPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="auth" element={<AuthPage />} />
            <Route path="auth/success" element={<AuthSuccess />} />
            <Route path="/payment-success/:orderId?" element={<PaymentSuccessPage />} />
            <Route path="/orders" element={<MyOrdersPage />} />
            <Route path='portfolio' element={<PortfolioPage />}/>

                 {/* Legal Pages */}
            <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="terms-of-service" element={<TermsOfServicePage />} />
            
            {/* Protected Profile Route within Layout */}
            <Route 
              path="profile" 
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              } 
            />
            
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Admin Routes with AdminLayout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="workshops" element={<AdminWorkshops />} />
            <Route path='registrations' element={<AdminWorkshopsRegistration />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="about" element={<AboutAdmin />} />
            <Route path='services' element={<AdminServices />} />
            <Route path='collaborators' element={<AdminCollaborators />} />
          </Route>
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

export default App;