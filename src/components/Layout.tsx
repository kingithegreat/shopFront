import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { Droplets, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';

export function Layout() {
  const { currentUser, userData, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    await signOut(auth);
    setMobileMenuOpen(false);
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans flex flex-col">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between w-full">
          <Link to="/" onClick={closeMenu} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-[#007AFF] rounded-lg flex items-center justify-center">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">FreshFold<span className="text-[#007AFF]">Tauranga</span></span>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-500">
            <Link to="/book" className={`transition-colors ${location.pathname === '/book' ? 'text-slate-900 font-bold' : 'hover:text-slate-900'}`}>Book Now</Link>
            
            {!loading && currentUser ? (
              <div className="flex items-center space-x-4">
                {userData?.role === 'admin' ? (
                  <Link to="/admin" className={`flex items-center space-x-1 transition-colors ${location.pathname === '/admin' ? 'text-slate-900 font-bold' : 'hover:text-slate-900'}`}>
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                ) : (
                  <Link to="/dashboard" className={`flex items-center space-x-1 transition-colors ${location.pathname === '/dashboard' ? 'text-slate-900 font-bold' : 'hover:text-slate-900'}`}>
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                )}
                
                <button 
                  onClick={handleLogout}
                  className="bg-slate-200/50 text-slate-600 px-3 py-1.5 rounded-full hover:bg-slate-200 transition-colors flex items-center space-x-1"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              !loading && (
                <Link to="/login" className="bg-[#007AFF] text-white px-5 py-2 rounded-full font-bold hover:bg-[#0063CC] transition-colors active:scale-[0.98]">
                  Sign In
                </Link>
              )
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-slate-200 shadow-xl p-4 flex flex-col space-y-4 font-medium z-40">
            <Link to="/" onClick={closeMenu} className="px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors">Home</Link>
            <Link to="/book" onClick={closeMenu} className="px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors font-bold text-[#007AFF]">Book Now</Link>
            
            {!loading && currentUser ? (
              <>
                <Link to={userData?.role === 'admin' ? '/admin' : '/dashboard'} onClick={closeMenu} className="px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors flex items-center space-x-2">
                  <LayoutDashboard className="w-5 h-5" />
                  <span>{userData?.role === 'admin' ? 'Admin Panel' : 'My Dashboard'}</span>
                </Link>
                <button onClick={handleLogout} className="px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 transition-colors text-left flex items-center space-x-2">
                  <LogOut className="w-5 h-5" />
                  <span>Sign out</span>
                </button>
              </>
            ) : (
              !loading && (
                <Link to="/login" onClick={closeMenu} className="px-4 py-3 rounded-xl bg-[#007AFF] text-white font-bold text-center active:scale-[0.98]">
                  Sign In / Register
                </Link>
              )
            )}
          </div>
        )}
      </header>

      <main className="flex-1 w-full max-w-[100vw] overflow-x-hidden flex flex-col">
        <Outlet />
      </main>

      {/* Sticky Mobile Book Now Button */}
      {location.pathname !== '/book' && !location.pathname.includes('/checkout') && (
        <div className="md:hidden fixed bottom-6 left-0 right-0 px-4 z-40">
          <Link to="/book" className="flex items-center justify-center w-full bg-[#007AFF] text-white py-4 rounded-full font-bold text-lg shadow-lg shadow-blue-500/30 active:scale-[0.98] transition-transform">
            Book a Pickup
          </Link>
        </div>
      )}

      <footer className="bg-[#1D1D1F] text-slate-400 py-20 mt-auto border-t border-slate-800 pb-32 md:pb-20 relative overflow-hidden">
        {/* SEO Hidden / Graceful block */}
        <div className="absolute opacity-5 pointer-events-none -top-10 -left-10 text-[200px] font-bold tracking-tighter whitespace-nowrap z-0">
          TAURANGA LAUNDRY
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
            <div className="col-span-2 lg:col-span-2 space-y-6">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-[#007AFF] rounded-lg flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold tracking-tight text-white">FreshFold<span className="text-[#007AFF]">Tauranga</span></span>
              </div>
              <p className="text-slate-400 leading-relaxed max-w-sm">
                 Premium laundry service Tauranga residents rely on. We provide expert laundry pickup Tauranga and free laundry delivery Tauranga wide, ensuring your garments return fresh and perfectly folded.
              </p>
              <div className="text-sm font-bold text-slate-300 uppercase tracking-widest mt-6">
                 Support: hello@freshfold.co.nz
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Service Areas</h4>
              <ul className="space-y-4 text-sm font-medium">
                 <li><Link to="/book" className="hover:text-white transition-colors">Tauranga Central</Link></li>
                 <li><Link to="/book" className="hover:text-white transition-colors">Mount Maunganui Laundry Service</Link></li>
                 <li><Link to="/book" className="hover:text-white transition-colors">Papamoa Laundry Service</Link></li>
                 <li><Link to="/book" className="hover:text-white transition-colors">Bethlehem & Pyes Pa</Link></li>
                 <li><Link to="/book" className="hover:text-white transition-colors">Welcome Bay & Tauriko</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Company</h4>
              <ul className="space-y-4 text-sm font-medium">
                 <li><Link to="/book" className="hover:text-white transition-colors">Pricing</Link></li>
                 <li><Link to="/book" className="hover:text-white transition-colors">Commercial & Business</Link></li>
                 <li><Link to="/book" className="hover:text-white transition-colors">FAQ</Link></li>
                 <li><Link to="/book" className="hover:text-white transition-colors">Opening Hours</Link></li>
                 <li><Link to="/book" className="hover:text-white transition-colors">Contact Details</Link></li>
              </ul>
            </div>

            <div className="col-span-2 lg:col-span-1">
              <h4 className="text-white font-bold mb-6">Legal</h4>
              <ul className="space-y-4 text-sm font-medium">
                 <li><Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                 <li><Link to="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
              
              <div className="mt-8 flex items-center gap-4">
                 <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-[#1D1D1F] transition-all">
                    IN
                 </a>
                 <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-[#1D1D1F] transition-all">
                    FB
                 </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-[11px] font-bold uppercase tracking-widest text-slate-500">
            <p className="mb-4 md:mb-0">© {new Date().getFullYear()} FreshFold Tauranga. All rights reserved.</p>
            <p>Designed for Tauranga Locals</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
