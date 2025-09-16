import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Search, 
  Lock, 
  Target, 
  Activity, 
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SystemStatus {
  service: string;
  status: 'online' | 'offline' | 'maintenance';
  lastCheck: string;
  icon: React.ElementType;
  color: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [systemLoad, setSystemLoad] = useState(0);

  const systemServices: SystemStatus[] = [
    {
      service: 'OSINT Engine',
      status: 'online',
      lastCheck: '2 min ago',
      icon: Search,
      color: 'text-cyber-blue'
    },
    {
      service: 'Password Vault',
      status: 'online',
      lastCheck: '1 min ago',
      icon: Lock,
      color: 'text-cyber-orange'
    },
    {
      service: 'Pentest Scanner',
      status: 'online',
      lastCheck: '3 min ago',
      icon: Target,
      color: 'text-cyber-red'
    },
    {
      service: 'Threat Intel',
      status: 'maintenance',
      lastCheck: '15 min ago',
      icon: Shield,
      color: 'text-cyber-green'
    }
  ];

  const recentActivities = [
    { action: 'Password generated', time: '5 min ago', type: 'success' },
    { action: 'OSINT search completed', time: '12 min ago', type: 'info' },
    { action: 'Pentest scan initiated', time: '25 min ago', type: 'warning' },
    { action: 'New threat signature added', time: '1 hour ago', type: 'success' },
  ];

  useEffect(() => {
    // Simulate system load animation
    const interval = setInterval(() => {
      setSystemLoad(prev => {
        const newValue = Math.random() * 100;
        return Math.abs(newValue - prev) > 30 ? prev + (newValue - prev) * 0.1 : newValue;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-4 h-4 text-cyber-green" />;
      case 'offline':
        return <AlertTriangle className="w-4 h-4 text-cyber-red" />;
      case 'maintenance':
        return <Clock className="w-4 h-4 text-cyber-orange" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-cyber-green" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-cyber-orange" />;
      case 'info':
        return <Activity className="w-4 h-4 text-cyber-blue" />;
      default:
        return <Activity className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, <span className="text-primary font-mono">{user?.name}</span>
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-card to-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Scans</CardTitle>
            <Target className="w-4 h-4 text-cyber-red" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">+2 from yesterday</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">OSINT Queries</CardTitle>
            <Search className="w-4 h-4 text-cyber-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">+18 from last week</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Passwords</CardTitle>
            <Lock className="w-4 h-4 text-cyber-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">All secured</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="w-4 h-4 text-cyber-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-primary" />
              <span>System Status</span>
            </CardTitle>
            <CardDescription>Real-time service monitoring</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {systemServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${service.color}`} />
                    <div>
                      <p className="font-medium">{service.service}</p>
                      <p className="text-xs text-muted-foreground font-mono">{service.lastCheck}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(service.status)}
                    <Badge variant={service.status === 'online' ? 'default' : 'secondary'}>
                      {service.status}
                    </Badge>
                  </div>
                </div>
              );
            })}

            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">System Load</span>
                <span className="text-sm font-mono">{Math.round(systemLoad)}%</span>
              </div>
              <Progress value={systemLoad} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-primary" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>Latest system events and actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground font-mono">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used tools and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-gradient-to-br from-cyber-blue/10 to-cyber-blue/5 border border-cyber-blue/20 hover:border-cyber-blue/40 transition-colors cursor-pointer">
              <Search className="w-8 h-8 text-cyber-blue mb-2" />
              <h3 className="font-semibold">New OSINT Search</h3>
              <p className="text-sm text-muted-foreground">Start intelligence gathering</p>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-br from-cyber-orange/10 to-cyber-orange/5 border border-cyber-orange/20 hover:border-cyber-orange/40 transition-colors cursor-pointer">
              <Lock className="w-8 h-8 text-cyber-orange mb-2" />
              <h3 className="font-semibold">Generate Password</h3>
              <p className="text-sm text-muted-foreground">Create secure credentials</p>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-br from-cyber-red/10 to-cyber-red/5 border border-cyber-red/20 hover:border-cyber-red/40 transition-colors cursor-pointer">
              <Target className="w-8 h-8 text-cyber-red mb-2" />
              <h3 className="font-semibold">Run Pentest</h3>
              <p className="text-sm text-muted-foreground">Execute security scan</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;