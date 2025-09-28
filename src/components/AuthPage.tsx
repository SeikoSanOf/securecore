import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Shield, Eye, EyeOff } from 'lucide-react';

const AuthPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  const { login, setUser, register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
    const result = await login(loginForm.email, loginForm.password);

    if (result.success && result.user) {
      toast({ title: 'Bienvenue', description: `Connexion réussie, ${result.user.name}` });
      navigate('/dashboard');
    } else {
      toast({
        title: result.error === "Compte non vérifié" ? 'Compte non vérifié' : 'Échec de l\'authentification',
        description: result.error || 'Une erreur est survenue.',
        variant: 'destructive'
      });
    }

    } catch (err) {
      toast({ title: 'Erreur', description: 'Une erreur est survenue.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      toast({ title: "Password mismatch", description: "Passwords do not match.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const success = await register(registerForm.name, registerForm.email, registerForm.password);
      if (success) {
        toast({ title: "Compte créé", description: "Bienvenue sur SecureCore !" });
        navigate('/dashboard');
      } else {
        toast({ title: "Échec", description: "Impossible de créer le compte.", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Erreur", description: "Une erreur est survenue.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader>
            <CardTitle className="text-center">Access Control</CardTitle>
            <CardDescription className="text-center">Secure authentication for cybersecurity professionals</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <Label>Email</Label>
                  <Input type="email" value={loginForm.email} onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} required />
                  <Label>Password</Label>
                  <div className="relative">
                    <Input type={showPassword ? 'text' : 'password'} value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} required />
                    <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'Authenticating...' : 'Login'}</Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <Label>Full Name</Label>
                  <Input type="text" value={registerForm.name} onChange={e => setRegisterForm({ ...registerForm, name: e.target.value })} required />
                  <Label>Email</Label>
                  <Input type="email" value={registerForm.email} onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })} required />
                  <Label>Password</Label>
                  <Input type={showPassword ? 'text' : 'password'} value={registerForm.password} onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })} required />
                  <Label>Confirm Password</Label>
                  <Input type={showPassword ? 'text' : 'password'} value={registerForm.confirmPassword} onChange={e => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })} required />
                  <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'Creating account...' : 'Create Account'}</Button>
                </form>
              </TabsContent>

            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
