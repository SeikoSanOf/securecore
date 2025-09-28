import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Shield, 
  Lock, 
  Search, 
  Target,
  User,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  FileText,
  Bell
} from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'text-blue-400' },
    { path: '/passwords', icon: Lock, label: 'Password Manager', color: 'text-purple-400' },
    { path: '/osint', icon: Search, label: 'OSINT Module', color: 'text-green-400' },
    { path: '/pentest', icon: Target, label: 'Pentest Suite', color: 'text-red-400' },
    { path: '/reports', icon: FileText, label: 'Rapports', color: 'text-yellow-400' },
    { path: '/notifications', icon: Bell, label: 'Notifications', color: 'text-pink-400' },
  ];

  return (
    <div className="min-h-screen bg-background flex relative">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 glass-card border-r border-white/10 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/30 to-blue-500/30 backdrop-blur-sm">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                    SecureCore
                  </h1>
                  <p className="text-xs text-muted-foreground font-mono">Bêta v1.0</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden hover:bg-white/10"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start h-12 transition-all duration-200 ${
                    isActive 
                      ? 'glass-button border border-primary/20 shadow-lg shadow-primary/10' 
                      : 'hover:glass hover:scale-105'
                  }`}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                >
                  <Icon className={`w-5 h-5 mr-3 ${item.color}`} />
                  <span className="font-medium">{item.label}</span>
                </Button>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-3">
              <button
                className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-white/5 transition-colors group"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500/30 to-blue-500/30 flex items-center justify-center backdrop-blur-sm border border-white/10">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground font-mono uppercase bg-primary/20 px-2 py-1 rounded-full inline-block">
                    {user?.role}
                  </p>
                </div>
              </button>
            </div>
            
            {profileMenuOpen && (
              <div className="space-y-2 mb-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    navigate('/profile');
                    setProfileMenuOpen(false);
                  }}
                >
                  <User className="w-4 h-4 mr-2" />
                  Mon Profil
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    navigate('/settings');
                    setProfileMenuOpen(false);
                  }}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Paramètres
                </Button>
              </div>
            )}
            
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start glass-button border-red-500/30 text-red-400 hover:bg-red-500/10"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0 relative">
        {/* Mobile Header */}
        <header className="lg:hidden glass-card border-b border-white/10 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-white/10"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-r from-purple-500/30 to-blue-500/30">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                SecureCore
              </span>
            </div>
            <div />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;