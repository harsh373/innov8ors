import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { Home, Package, History, MapPin, User } from 'lucide-react';

const MobileNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/products', icon: Package, label: 'Products' },
    { path: '/history', icon: History, label: 'History' },
    { path: '/market-map', icon: MapPin, label: 'Map' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-50 border-b border-gray-200">
        <div className="flex justify-between items-center h-16 px-4">
          <div 
            className="text-2xl font-bold text-blue-600 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            FairPrice
          </div>
          <UserButton afterSignOutUrl="/login" />
        </div>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 safe-area-bottom">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 ${
                  active ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                <div className={`relative ${active ? 'transform -translate-y-1' : ''}`}>
                  <div className={`p-2 rounded-full transition-all duration-200 ${
                    active ? 'bg-blue-50' : ''
                  }`}>
                    <Icon size={24} strokeWidth={active ? 2.5 : 2} />
                  </div>
                </div>
                <span className={`text-xs mt-1 font-medium ${
                  active ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default MobileNavbar;