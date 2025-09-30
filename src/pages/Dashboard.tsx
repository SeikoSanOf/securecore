import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardStats, useDashboardMetrics, useRealTimeUpdates } from '@/hooks/useAPI';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Search, 
  Lock, 
  Target,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Wifi,
  Zap,
  Database,
  Users,
  BarChart3,
  RefreshCw,
  ExternalLink,
  Eye,
  Download,
  Plus,
  FileText
} from 'lucide-react';

interface SystemStatus {
  service: string;
  status: 'operational' | 'degraded' | 'maintenance' | 'offline';
  lastCheck: string;
  icon: React.ElementType;
  color: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [systemLoad, setSystemLoad] = useState(67);
  
  // Use API hooks for real-time data
  const { data: dashboardStats, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useDashboardStats();
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics();
  
  // Enable real-time updates
  useRealTimeUpdates();

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemLoad(prev => {
        const change = Math.random() * 10 - 5;
        return Math.max(0, Math.min(100, prev + change));
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Mock data structure matching API types (replace with real API data when available)
  const stats = dashboardStats?.data || {
    total_scans: 0,
    active_threats: 0,
    passwords_stored: 0,
    system_health: 0,
    recent_activity: [],
    system_services: []
  };

  const systemServices = stats.system_services?.map((service: any) => ({
    ...service,
    icon: service.type === 'web_scanner' ? Target :
          service.type === 'osint_engine' ? Search :
          service.type === 'password_vault' ? Lock :
          service.type === 'threat_intel' ? Shield : BarChart3,
    color: service.status === 'operational' ? 'text-green-400' :
           service.status === 'degraded' ? 'text-orange-400' :
           service.status === 'maintenance' ? 'text-yellow-400' : 'text-red-400'
  })) || [];

  const handleRefresh = async () => {
    try {
      await refetchStats();
      toast({
        title: "Dashboard Updated",
        description: "Latest security metrics have been refreshed.",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to update dashboard metrics.",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'degraded':
        return <AlertCircle className="w-4 h-4 text-orange-400" />;
      case 'maintenance':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'offline':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'scan_completed':
        return <Target className="w-4 h-4" />;
      case 'threat_detected':
        return <AlertCircle className="w-4 h-4" />;
      case 'osint_query':
        return <Search className="w-4 h-4" />;
      case 'password_audit':
        return <Lock className="w-4 h-4" />;
      case 'report_generated':
        return <BarChart3 className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  if (statsError) {
    return (
      <div className="p-6 space-y-6 min-h-screen">
        <Card className="glass-card border-red-500/30">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Dashboard Error</h3>
              <p className="text-muted-foreground mb-4">Failed to load dashboard metrics</p>
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 min-h-screen relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-br from-purple-500/5 to-blue-500/5 blur-2xl animate-pulse delay-500" />
      </div>

      {/* Header Section */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-primary bg-clip-text text-transparent mb-2">
            Welcome back, {user?.name}
          </h1>
          <p className="text-muted-foreground text-lg">
            SecureCore Security Dashboard
          </p>
          <div className="flex items-center mt-2 space-x-4">
            <Badge variant="secondary" className="bg-primary/20 text-primary">
              {user?.role?.toUpperCase()}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Last login: {new Date().toLocaleString()}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="glass border-primary/30 hover:border-primary/50"
            disabled={statsLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${statsLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card border border-blue-500/30 hover:border-blue-500/50 transition-colors duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Scans</CardTitle>
            <Target className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-16 mb-1" />
            ) : (
              <div className="text-3xl font-bold text-blue-400 mb-1">{stats.total_scans?.toLocaleString()}</div>
            )}
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="w-3 h-3 mr-1 text-green-400" />
              +12% from last hour
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border border-red-500/30 hover:border-red-500/50 transition-colors duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Threats</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-16 mb-1" />
            ) : (
              <div className="text-3xl font-bold text-red-400 mb-1">{stats.active_threats}</div>
            )}
            <p className="text-xs text-muted-foreground flex items-center">
              <AlertCircle className="w-3 h-3 mr-1 text-red-400" />
              Requires attention
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border border-purple-500/30 hover:border-purple-500/50 transition-colors duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Stored Passwords</CardTitle>
            <Lock className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-16 mb-1" />
            ) : (
              <div className="text-3xl font-bold text-purple-400 mb-1">{stats.passwords_stored}</div>
            )}
            <p className="text-xs text-muted-foreground flex items-center">
              <Shield className="w-3 h-3 mr-1 text-purple-400" />
              200% secure
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border border-orange-500/30 hover:border-orange-500/50 transition-colors duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">System Health</CardTitle>
            <Activity className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-16 mb-1" />
            ) : (
              <div className="text-3xl font-bold text-orange-400 mb-1">{stats.system_health}%</div>
            )}
            <p className="text-xs text-muted-foreground flex items-center">
              <CheckCircle className="w-3 h-3 mr-1 text-green-400" />
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Status */}
        <Card className="lg:col-span-2 glass-card border border-white/10 hover:border-primary/30 transition-colors duration-300">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-primary" />
              System Status
            </CardTitle>
            <CardDescription>Real-time service monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemServices.map((service, index) => {
                const Icon = service.icon;
                return (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg glass hover:bg-white/5 transition-colors duration-200 group">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-white/10">
                        <Icon className={`w-5 h-5 ${service.color}`} />
                      </div>
                      <div>
                        <p className="font-medium">{service.service}</p>
                        <p className="text-xs text-muted-foreground font-mono">{service.lastCheck}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(service.status)}
                      <Badge 
                        className={`${
                          service.status === 'operational' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                          service.status === 'degraded' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                          service.status === 'maintenance' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                          'bg-red-500/20 text-red-400 border-red-500/30'
                        } capitalize`}
                      >
                        {service.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}

              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-foreground">System Load</span>
                  <span className="text-sm font-mono bg-primary/20 px-2 py-1 rounded text-primary">
                    {Math.round(systemLoad)}%
                  </span>
                </div>
                <Progress value={systemLoad} className="h-3 bg-white/10" />
                <div className="flex items-center mt-2 space-x-2">
                  <Wifi className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    CPU: {Math.round(systemLoad * 0.8)}% | RAM: {Math.round(systemLoad * 1.2)}% | Network: Active
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="glass-card border border-white/10 hover:border-primary/30 transition-colors duration-300">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest security events</CardDescription>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-start space-x-3 p-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {stats.recent_activity?.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg glass hover:bg-white/5 transition-colors duration-200">
                    <div className={`p-1.5 rounded-full ${
                      activity.severity === 'success' ? 'bg-green-500/20 text-green-400' :
                      activity.severity === 'error' ? 'bg-red-500/20 text-red-400' :
                      activity.severity === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground leading-relaxed">{activity.message}</p>
                      <div className="flex items-center mt-1 space-x-2">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                )) || (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No recent activity</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="relative z-10">
        <Card className="glass-card border border-white/10 hover:border-primary/30 transition-colors duration-300">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common security operations</CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              const quickActions = [
                { 
                  title: 'Password Manager', 
                  description: 'Gérer vos mots de passe en sécurité',
                  icon: Lock,
                  path: '/passwords',
                  color: 'text-purple-400',
                  bgColor: 'from-purple-500/20 to-purple-600/20',
                  highlight: true
                },
                { 
                  title: 'OSINT Module', 
                  description: 'Recherche d\'informations',
                  icon: Search,
                  path: '/osint',
                  color: 'text-green-400',
                  bgColor: 'from-green-500/20 to-green-600/20'
                },
                { 
                  title: 'Pentest Suite', 
                  description: 'Outils de test d\'intrusion',
                  icon: Target,
                  path: '/pentest',
                  color: 'text-red-400',
                  bgColor: 'from-red-500/20 to-red-600/20'
                },
                { 
                  title: 'Rapports', 
                  description: 'Consulter les rapports',
                  icon: FileText,
                  path: '/reports',
                  color: 'text-yellow-400',
                  bgColor: 'from-yellow-500/20 to-yellow-600/20'
                }
              ];

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => navigate(action.path)}
                      className={`relative overflow-hidden rounded-xl p-6 text-left transition-all duration-300 hover:scale-105 bg-gradient-to-br ${action.bgColor} glass-card border ${action.highlight ? 'border-purple-500/30 shadow-lg shadow-purple-500/10' : 'border-white/10'} hover:border-white/20 group`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <action.icon className={`w-8 h-8 ${action.color} transition-transform group-hover:scale-110`} />
                        {action.highlight && (
                          <div className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-semibold rounded-full border border-purple-500/30">
                            PRIORITÉ
                          </div>
                        )}
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-foreground leading-tight">{action.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{action.description}</p>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                    </button>
                  ))}
                </div>
              );
            })()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;