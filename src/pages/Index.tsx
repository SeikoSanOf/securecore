import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Shield, Target, Search, Lock, BarChart3, CheckCircle, ArrowRight, Zap, Globe, Users } from 'lucide-react';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [animatedStats, setAnimatedStats] = useState({ scans: 0, threats: 0, users: 0 });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
      return;
    }

    // Animate stats
    const interval = setInterval(() => {
      setAnimatedStats(prev => ({
        scans: Math.min(prev.scans + Math.floor(Math.random() * 50), 2847),
        threats: Math.min(prev.threats + Math.floor(Math.random() * 20), 1293),
        users: Math.min(prev.users + Math.floor(Math.random() * 10), 856)
      }));
    }, 100);

    const timeout = setTimeout(() => clearInterval(interval), 2000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading SecureCore...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="relative z-10 glass border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500/30 to-blue-500/30 backdrop-blur-sm border border-white/20">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                  SecureCore
                </h1>
                <p className="text-xs text-muted-foreground font-mono">Enterprise Cybersecurity Platform</p>
              </div>
            </div>
            <Button 
              onClick={() => navigate('/auth')}
              className="glass-button border border-primary/30 hover:border-primary/50"
            >
              Access Platform
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary/20 text-primary border border-primary/30">
                <Zap className="w-4 h-4 mr-2" />
                Next-Gen Security Platform
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-primary to-purple-400 bg-clip-text text-transparent leading-tight">
              Secure Your Digital
              <br />
              <span className="text-primary">Ecosystem</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Advanced penetration testing, OSINT reconnaissance, and comprehensive security management 
              in one unified platform. Built for security professionals.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button 
                size="lg" 
                onClick={() => navigate('/auth')}
                className="text-lg px-8 py-6 glass-button border border-primary/40 hover:border-primary/60 hover:scale-105 transition-all duration-300"
              >
                Start Security Audit
                <Target className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => {
                  // Simulate demo login and redirect to dashboard
                  const demoUser = {
                    id: 'demo',
                    email: 'demo@securecore.com',
                    name: 'Demo User',
                    role: 'analyst' as const,
                    created_at: new Date().toISOString(),
                    email_verified: true
                  };
                  localStorage.setItem('demo_mode', 'true');
                  localStorage.setItem('auth_token', 'demo_token');
                  navigate('/dashboard');
                }}
                className="text-lg px-8 py-6 glass border border-white/20 hover:border-white/30 hover:scale-105 transition-all duration-300"
              >
                View Demo
                <Globe className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              <div className="glass-card p-8 text-center border border-white/10 hover:border-primary/30 transition-colors duration-300">
                <div className="text-4xl font-bold text-primary mb-2 font-mono">
                  {animatedStats.scans.toLocaleString()}+
                </div>
                <div className="text-muted-foreground font-medium">Security Scans</div>
              </div>
              <div className="glass-card p-8 text-center border border-white/10 hover:border-primary/30 transition-colors duration-300">
                <div className="text-4xl font-bold text-red-400 mb-2 font-mono">
                  {animatedStats.threats.toLocaleString()}+
                </div>
                <div className="text-muted-foreground font-medium">Threats Detected</div>
              </div>
              <div className="glass-card p-8 text-center border border-white/10 hover:border-primary/30 transition-colors duration-300">
                <div className="text-4xl font-bold text-green-400 mb-2 font-mono">
                  {animatedStats.users.toLocaleString()}+
                </div>
                <div className="text-muted-foreground font-medium">Active Users</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
              Enterprise Security Suite
            </h2>
            <p className="text-xl text-muted-foreground">
              Complete cybersecurity toolkit for modern organizations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="glass-card p-8 border border-white/10 hover:border-red-500/30 transition-all duration-300 hover:scale-105">
              <div className="p-4 rounded-xl bg-red-500/20 w-fit mb-4">
                <Target className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Penetration Testing</h3>
              <p className="text-muted-foreground mb-4">Advanced vulnerability assessment and exploitation framework</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  Web Application Security
                </li>
                <li className="flex items-center text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  Network Penetration
                </li>
                <li className="flex items-center text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  API Security Testing
                </li>
              </ul>
            </div>

            <div className="glass-card p-8 border border-white/10 hover:border-blue-500/30 transition-all duration-300 hover:scale-105">
              <div className="p-4 rounded-xl bg-blue-500/20 w-fit mb-4">
                <Search className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">OSINT Intelligence</h3>
              <p className="text-muted-foreground mb-4">Open-source intelligence gathering and reconnaissance</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  Domain Intelligence
                </li>
                <li className="flex items-center text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  Social Media Analysis
                </li>
                <li className="flex items-center text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  Dark Web Monitoring
                </li>
              </ul>
            </div>

            <div className="glass-card p-8 border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:scale-105">
              <div className="p-4 rounded-xl bg-purple-500/20 w-fit mb-4">
                <Lock className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Password Security</h3>
              <p className="text-muted-foreground mb-4">Enterprise password management and breach detection</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  AES Encryption
                </li>
                <li className="flex items-center text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  Breach Monitoring
                </li>
                <li className="flex items-center text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  Policy Enforcement
                </li>
              </ul>
            </div>

            <div className="glass-card p-8 border border-white/10 hover:border-green-500/30 transition-all duration-300 hover:scale-105">
              <div className="p-4 rounded-xl bg-green-500/20 w-fit mb-4">
                <BarChart3 className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Security Analytics</h3>
              <p className="text-muted-foreground mb-4">Real-time monitoring and comprehensive reporting</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  Risk Assessment
                </li>
                <li className="flex items-center text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  Compliance Reporting
                </li>
                <li className="flex items-center text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  Threat Intelligence
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="container mx-auto px-4 py-20">
          <div className="glass-card border border-white/10 p-12 text-center">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
              Ready to Secure Your Organization ?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of security professionals using SecureCore to protect their digital assets
            </p>
            <Button 
              size="lg"
              onClick={() => navigate('/auth')}
              className="text-lg px-12 py-6 glass-button border border-primary/40 hover:border-primary/60 hover:scale-105 transition-all duration-300"
            >
              Start Free Trial
              <Users className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 glass border-t border-white/10 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <Shield className="w-6 h-6 text-primary" />
              <span className="font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                SecureCore
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 SecureCore. Enterprise Security Platform.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
