import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Shield, 
  Calendar,
  Save,
  Edit
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
            Mon Profil
          </h1>
          <p className="text-muted-foreground">
            Gérer vos informations personnelles
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <Card className="lg:col-span-2 glass-card border border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2 text-primary" />
              Informations Personnelles
            </CardTitle>
            <CardDescription>Vos données de profil</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input 
                  id="name" 
                  value={user?.name || ''} 
                  readOnly 
                  className="glass"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  value={user?.email || ''} 
                  readOnly 
                  className="glass"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Rôle</Label>
              <div className="flex items-center space-x-2">
                <Badge className="bg-primary/20 text-primary">
                  {user?.role?.toUpperCase()}
                </Badge>
              </div>
            </div>

            <div className="pt-4">
              <Button className="w-full md:w-auto">
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Summary */}
        <Card className="glass-card border border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-primary" />
              Résumé du Compte
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg glass border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Statut</span>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  Actif
                </Badge>
              </div>
            </div>
            
            <div className="p-4 rounded-lg glass border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Dernière connexion</span>
                <span className="text-sm font-mono">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-lg glass border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Compte créé</span>
                <span className="text-sm font-mono">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;