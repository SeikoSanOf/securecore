import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Mail, 
  Shield, 
  Calendar,
  Save,
  Edit,
  Camera,
  Upload
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: ''
  });

  const handleSave = () => {
    // Ici vous connecterez à votre API pour sauvegarder
    setIsEditing(false);
    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été sauvegardées avec succès."
    });
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData({
          ...profileData,
          avatar: e.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

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
        {/* Photo de profil */}
        <Card className="glass-card border border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Camera className="w-5 h-5 mr-2 text-primary" />
              Photo de Profil
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-primary/20">
                <AvatarImage src={profileData.avatar} alt={profileData.name} />
                <AvatarFallback className="text-2xl bg-gradient-to-r from-purple-500/30 to-blue-500/30">
                  {profileData.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button 
                size="sm" 
                className="absolute -bottom-2 -right-2 rounded-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4" />
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <p className="text-sm text-muted-foreground text-center">
              Cliquez sur le bouton pour changer votre photo
            </p>
          </CardContent>
        </Card>

        {/* Profile Info */}
        <Card className="lg:col-span-2 glass-card border border-white/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2 text-primary" />
                  Informations Personnelles
                </CardTitle>
                <CardDescription>Vos données de profil</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="w-4 h-4 mr-2" />
                {isEditing ? 'Annuler' : 'Modifier'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input 
                  id="name" 
                  value={profileData.name} 
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  readOnly={!isEditing}
                  className="glass"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  value={profileData.email} 
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  readOnly={!isEditing}
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

            {isEditing && (
              <div className="pt-4 flex space-x-2">
                <Button onClick={handleSave} className="flex-1 md:flex-initial">
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  className="flex-1 md:flex-initial"
                >
                  Annuler
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Summary */}
        <Card className="lg:col-span-3 glass-card border border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-primary" />
              Résumé du Compte
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;