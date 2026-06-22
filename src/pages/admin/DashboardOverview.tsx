import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Package, Map, Settings, Users, Shirt, Activity, Link as LinkIcon } from 'lucide-react';

export function DashboardOverview() {
  const { userData } = useAuth();
  
  const quickLinks = [
    { title: 'Manage Orders', icon: Package, href: '/admin/orders', desc: 'Process pickups and deliveries', color: 'bg-blue-500' },
    { title: 'Update Pricing', icon: Shirt, href: '/admin/services', desc: 'Add or modify laundry services', color: 'bg-indigo-500' },
    { title: 'Service Area', icon: Map, href: '/admin/service-area', desc: 'Configure delivery zones', color: 'bg-rose-500' },
    { title: 'Customers', icon: Users, href: '/admin/customers', desc: 'View client directory', color: 'bg-emerald-500' },
    { title: 'Booking Rules', icon: Activity, href: '/admin/booking-settings', desc: 'Set availability and limits', color: 'bg-amber-500' },
    { title: 'Business Info', icon: Settings, href: '/admin/business-settings', desc: 'Contact details and hours', color: 'bg-slate-700' },
    { title: 'Integrations', icon: LinkIcon, href: '/admin/integrations', desc: 'Payments, Email, SMS', color: 'bg-purple-500', restrictOwner: true },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#1D1D1F]">Welcome back, Admin</h1>
        <p className="text-slate-500 mt-2">Here is a quick overview of your FreshFold business controls.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickLinks.map((link) => {
          if (link.restrictOwner && userData?.role !== 'owner') return null;
          return (
            <Link key={link.href} to={link.href} className="group bg-white p-6 rounded-[2rem] border border-[#E5E5EA] shadow-sm hover:shadow-xl hover:border-slate-300 transition-all flex items-start gap-4">
               <div className={`${link.color} text-white p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                  <link.icon className="w-6 h-6" />
               </div>
               <div>
                  <h3 className="font-bold text-[#1D1D1F] text-lg">{link.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">{link.desc}</p>
               </div>
            </Link>
          );
        })}
      </div>
      
      <div className="bg-[#1D1D1F] rounded-[2rem] p-8 text-white mt-12 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 opacity-20 blur-3xl rounded-full" />
         <h2 className="text-2xl font-bold mb-2 relative z-10">System Status</h2>
         <p className="text-slate-400 relative z-10 mb-6 max-w-xl">
           The admin panel is active. All changes made in this dashboard will instantly reflect on the customer-facing website and booking forms.
         </p>
         <div className="flex gap-4 relative z-10">
            <Link to="/book" target="_blank" className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full font-bold transition-colors">Test Booking Flow</Link>
            <Link to="/" target="_blank" className="bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-slate-200 transition-colors">View Live Website</Link>
         </div>
      </div>
    </div>
  );
}
