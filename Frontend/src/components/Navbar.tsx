import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';
import { Home, Package, History, MapPin, User } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/products', icon: Package, label: 'Products' },
    { path: '/history', icon: History, label: 'History' },
    { path: '/market-map', icon: MapPin, label: 'Map' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="hidden md:block bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <div className="text-2xl font-bold text-blue-600">FairPrice</div>
          </div>

          <div className="flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {user?.firstName || 'User'}
              </div>
              <div className="text-xs text-gray-500">
                {user?.primaryEmailAddress?.emailAddress}
              </div>
            </div>
            <UserButton afterSignOutUrl="/login" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;