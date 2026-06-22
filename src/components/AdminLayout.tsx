import { useState } from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { 
  Building2, 
  Settings, 
  Users, 
  Package, 
  Clock, 
  Map, 
  Image as ImageIcon,
  Tag,
  LayoutDashboard,
  Shirt,
  PlusCircle,
  Globe,
  LayoutTemplate,
  LogOut,
  Menu,
  X,
  Link as LinkIcon
} from 'lucide-react';

export function AdminLayout() {
  const { userData, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) {
    return <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">Loading...</div>;
  }

  if (!userData || (userData.role !== 'admin' && userData.role !== 'owner')) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogout = async () => {
    await signOut(auth);
  };

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/orders', icon: Package, label: 'Orders' },
    { to: '/admin/customers', icon: Users, label: 'Customers' },
    { to: '/admin/services', icon: Shirt, label: 'Services & Pricing' },
    { to: '/admin/addons', icon: PlusCircle, label: 'Add-ons' },
    { to: '/admin/promo-codes', icon: Tag, label: 'Promo Codes' },
    { to: '/admin/website', icon: Globe, label: 'Website Content' },
    { to: '/admin/layout', icon: LayoutTemplate, label: 'Page Layout' },
    { to: '/admin/booking-settings', icon: Clock, label: 'Booking Rules' },
    { to: '/admin/service-area', icon: Map, label: 'Service Area' },
    { to: '/admin/media', icon: ImageIcon, label: 'Media Library' },
    { to: '/admin/business-settings', icon: Building2, label: 'Business Settings', restrictOwner: true },
    { to: '/admin/integrations', icon: LinkIcon, label: 'Integrations', restrictOwner: true },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-[#1D1D1F] text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <span className="font-bold">FreshFold Admin</span>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[#1D1D1F] text-slate-300 transform transition-transform duration-300 ease-in-out flex flex-col
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        md:relative md:flex-shrink-0
      `}>
        <div className="p-6">
          <div className="text-white font-bold text-xl tracking-tight mb-8">FreshFold <span className="text-[#007AFF]">Admin</span></div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              if (item.restrictOwner && userData.role !== 'owner') return null;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => `
                    flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium
                    ${isActive ? 'bg-[#007AFF] text-white' : 'hover:bg-white/10 hover:text-white'}
                  `}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="p-6 mt-auto">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/10 hover:text-white transition-colors text-sm font-medium w-full text-left"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-[100vw] md:max-w-none overflow-x-hidden p-4 md:p-8 ml-0 md:ml-0 overflow-y-auto w-full">
        <div className="max-w-6xl mx-auto">
           <Outlet />
        </div>
      </div>
      
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
