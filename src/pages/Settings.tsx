import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Palette,
  Database,
  Download,
  Trash2
} from 'lucide-react';

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
            Paramètres
          </h1>
          <p className="text-muted-foreground">
            Configurer votre expérience SecureCore
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card className="glass-card border border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center">
              <SettingsIcon className="w-5 h-5 mr-2 text-primary" />
              Général
            </CardTitle>
            <CardDescription>Paramètres généraux de l'application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Recevoir des alertes en temps réel
                </p>
              </div>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="darkmode">Mode sombre</Label>
                <p className="text-sm text-muted-foreground">
                  Interface en mode sombre
                </p>
              </div>
              <Switch
                id="darkmode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autosave">Sauvegarde automatique</Label>
                <p className="text-sm text-muted-foreground">
                  Sauvegarder automatiquement les modifications
                </p>
              </div>
              <Switch
                id="autosave"
                checked={autoSave}
                onCheckedChange={setAutoSave}
              />
            </div>

            <div className="space-y-2">
              <Label>Langue</Label>
              <Select defaultValue="fr">
                <SelectTrigger className="glass">
                  <SelectValue placeholder="Sélectionner une langue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="glass-card border border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-primary" />
              Sécurité
            </CardTitle>
            <CardDescription>Paramètres de sécurité avancés</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Timeout de session</Label>
              <Select defaultValue="30">
                <SelectTrigger className="glass">
                  <SelectValue placeholder="Sélectionner le timeout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 heure</SelectItem>
                  <SelectItem value="never">Jamais</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Niveau de sécurité</Label>
              <Select defaultValue="high">
                <SelectTrigger className="glass">
                  <SelectValue placeholder="Niveau de sécurité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Bas</SelectItem>
                  <SelectItem value="medium">Moyen</SelectItem>
                  <SelectItem value="high">Élevé</SelectItem>
                  <SelectItem value="paranoid">Paranoïaque</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" className="w-full glass">
              <Shield className="w-4 h-4 mr-2" />
              Changer le mot de passe
            </Button>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="glass-card border border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2 text-primary" />
              Gestion des Données
            </CardTitle>
            <CardDescription>Exporter et gérer vos données</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full glass">
              <Download className="w-4 h-4 mr-2" />
              Exporter mes données
            </Button>

            <Button variant="outline" className="w-full glass border-red-500/30 text-red-400 hover:bg-red-500/10">
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer mon compte
            </Button>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="glass-card border border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="w-5 h-5 mr-2 text-primary" />
              Apparence
            </CardTitle>
            <CardDescription>Personnaliser l'interface</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Thème</Label>
              <Select defaultValue="cyber">
                <SelectTrigger className="glass">
                  <SelectValue placeholder="Sélectionner un thème" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cyber">Cyber</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="neon">Neon</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Densité</Label>
              <Select defaultValue="comfortable">
                <SelectTrigger className="glass">
                  <SelectValue placeholder="Densité d'affichage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compact">Compact</SelectItem>
                  <SelectItem value="comfortable">Confortable</SelectItem>
                  <SelectItem value="spacious">Spacieux</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;