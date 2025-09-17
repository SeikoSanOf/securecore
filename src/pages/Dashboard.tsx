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
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'offline':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'maintenance':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'info':
        return <Activity className="w-4 h-4 text-blue-400" />;
      default:
        return <Activity className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-background via-background to-purple-900/20">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <div className="relative space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Bienvenue, <span className="text-primary font-mono bg-primary/10 px-2 py-1 rounded-md">{user?.name}</span>
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        <Card className="glass-card border-0 group hover:scale-105 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scans Actifs</CardTitle>
            <div className="p-2 rounded-lg bg-red-500/20 group-hover:bg-red-500/30 transition-colors">
              <Target className="w-4 h-4 text-red-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-red-400 to-red-300 bg-clip-text text-transparent">3</div>
            <p className="text-xs text-muted-foreground">+2 depuis hier</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-0 group hover:scale-105 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requêtes OSINT</CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
              <Search className="w-4 h-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">127</div>
            <p className="text-xs text-muted-foreground">+18 cette semaine</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-0 group hover:scale-105 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mots de Passe</CardTitle>
            <div className="p-2 rounded-lg bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
              <Lock className="w-4 h-4 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">24</div>
            <p className="text-xs text-muted-foreground">Tous sécurisés</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-0 group hover:scale-105 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Santé Système</CardTitle>
            <div className="p-2 rounded-lg bg-green-500/20 group-hover:bg-green-500/30 transition-colors">
              <Activity className="w-4 h-4 text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">98%</div>
            <p className="text-xs text-muted-foreground">Systèmes opérationnels</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
        {/* System Status */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-primary/20">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <span>État du Système</span>
            </CardTitle>
            <CardDescription>Surveillance en temps réel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {systemServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg glass hover:bg-white/10 transition-all">
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
                      className={service.status === 'online' 
                        ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                        : service.status === 'maintenance'
                        ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                        : 'bg-red-500/20 text-red-400 border-red-500/30'
                      }
                    >
                      {service.status}
                    </Badge>
                  </div>
                </div>
              );
            })}

            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Charge Système</span>
                <span className="text-sm font-mono bg-primary/20 px-2 py-1 rounded">{Math.round(systemLoad)}%</span>
              </div>
              <Progress value={systemLoad} className="h-3 bg-white/10" />
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-primary/20">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <span>Activité Récente</span>
            </CardTitle>
            <CardDescription>Derniers événements système</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg glass hover:bg-white/10 transition-all">
                  <div className="p-1.5 rounded-lg bg-white/10">
                    {getActivityIcon(activity.type)}
                  </div>
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
      <Card className="glass-card border-0 relative">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-primary/20">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <span>Actions Rapides</span>
          </CardTitle>
          <CardDescription>Outils et raccourcis fréquemment utilisés</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-button p-6 rounded-xl cursor-pointer group hover:scale-105 transition-all duration-300 border border-blue-500/20 hover:border-blue-500/40">
              <div className="p-3 rounded-lg bg-blue-500/20 w-fit mb-4 group-hover:bg-blue-500/30 transition-colors">
                <Search className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Nouvelle Recherche OSINT</h3>
              <p className="text-sm text-muted-foreground">Lancer une collecte d'intelligence</p>
            </div>

            <div className="glass-button p-6 rounded-xl cursor-pointer group hover:scale-105 transition-all duration-300 border border-purple-500/20 hover:border-purple-500/40">
              <div className="p-3 rounded-lg bg-purple-500/20 w-fit mb-4 group-hover:bg-purple-500/30 transition-colors">
                <Lock className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Générer Mot de Passe</h3>
              <p className="text-sm text-muted-foreground">Créer des identifiants sécurisés</p>
            </div>

            <div className="glass-button p-6 rounded-xl cursor-pointer group hover:scale-105 transition-all duration-300 border border-red-500/20 hover:border-red-500/40">
              <div className="p-3 rounded-lg bg-red-500/20 w-fit mb-4 group-hover:bg-red-500/30 transition-colors">
                <Target className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Lancer Pentest</h3>
              <p className="text-sm text-muted-foreground">Exécuter un scan de sécurité</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;