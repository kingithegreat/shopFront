/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ConfigProvider, useConfig } from './contexts/ConfigContext';
import { Layout } from './components/Layout';
import { AdminLayout } from './components/AdminLayout';
import { LandingPage } from './pages/LandingPage';
import { BookingPage } from './pages/BookingPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { LoginPage } from './pages/LoginPage';
import { SetupWizard } from './pages/setup/SetupWizard';

// Admin Pages
import { DashboardOverview } from './pages/admin/DashboardOverview';
import { OrdersManager } from './pages/admin/OrdersManager';
import { ServicesManager } from './pages/admin/ServicesManager';
import { AddonsManager } from './pages/admin/AddonsManager';
import { PromoCodesManager } from './pages/admin/PromoCodesManager';
import { WebsiteEditor } from './pages/admin/WebsiteEditor';
import { LayoutManager } from './pages/admin/LayoutManager';
import { BookingSettings } from './pages/admin/BookingSettings';
import { ServiceAreaManager } from './pages/admin/ServiceAreaManager';
import { BusinessSettings } from './pages/admin/BusinessSettings';
import { CustomersManager } from './pages/admin/CustomersManager';
import { MediaManager } from './pages/admin/MediaManager';
import { IntegrationsManager } from './pages/admin/IntegrationsManager';
import { Loader2 } from 'lucide-react';

function AppRoutes() {
  const { isConfigured, loading: configLoading } = useConfig();
  const { userData, loading: authLoading } = useAuth();

  if (configLoading || authLoading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-[#F5F5F7]"><Loader2 className="w-8 h-8 animate-spin text-[#007AFF]" /></div>;
  }

  if (!isConfigured) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/setup" element={<SetupWizard />} />
        <Route path="*" element={
          userData?.role === 'owner' ? <Navigate to="/setup" replace /> : 
          <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F7] p-8 text-center">
            <h1 className="text-3xl font-bold text-[#1D1D1F] mb-4">Coming Soon</h1>
            <p className="text-slate-500 mb-8 max-w-md">Our platform is currently being set up. Please check back later.</p>
            {!userData && <a href="/login" className="text-sm font-bold text-[#007AFF] hover:underline">Owner Login</a>}
            {userData && userData.role !== 'owner' && <p className="text-sm font-bold text-slate-400">Logged in as {userData.email} (Not an owner)</p>}
          </div>
        } />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="book" element={<BookingPage />} />
        <Route path="checkout/:id" element={<CheckoutPage />} />
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="login" element={<LoginPage />} />
      </Route>
      
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardOverview />} />
        <Route path="orders" element={<OrdersManager />} />
        <Route path="services" element={<ServicesManager />} />
        <Route path="addons" element={<AddonsManager />} />
        <Route path="promo-codes" element={<PromoCodesManager />} />
        <Route path="website" element={<WebsiteEditor />} />
        <Route path="layout" element={<LayoutManager />} />
        <Route path="booking-settings" element={<BookingSettings />} />
        <Route path="service-area" element={<ServiceAreaManager />} />
        <Route path="customers" element={<CustomersManager />} />
        <Route path="media" element={<MediaManager />} />
        <Route path="business-settings" element={<BusinessSettings />} />
        <Route path="integrations" element={<IntegrationsManager />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ConfigProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ConfigProvider>
    </AuthProvider>
  );
}
