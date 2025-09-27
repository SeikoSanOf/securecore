import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Palette,
  Database,
  Download,
  Trash2,
  Save
} from 'lucide-react';

const Settings = () => {
  const { toast } = useToast();
  
  // État des paramètres
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: true,
    autoSave: true,
    language: 'fr',
    sessionTimeout: '30',
    securityLevel: 'high',
    theme: 'cyber',
    density: 'comfortable'
  });

  // Charger les paramètres sauvegardés
  useEffect(() => {
    const savedSettings = localStorage.getItem('securecore_settings');
    if (savedSettings) {
      setSettings({ ...settings, ...JSON.parse(savedSettings) });
    }
  }, []);

  // Sauvegarder les paramètres
  const saveSettings = (newSettings: typeof settings) => {
    setSettings(newSettings);
    localStorage.setItem('securecore_settings', JSON.stringify(newSettings));
    toast({
      title: "Paramètres sauvegardés",
      description: "Vos préférences ont été mises à jour."
    });
  };

  const updateSetting = (key: keyof typeof settings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  };

  const exportData = () => {
    const data = {
      settings,
      passwords: JSON.parse(localStorage.getItem('securecore_passwords') || '[]'),
      reports: JSON.parse(localStorage.getItem('securecore_pentest_reports') || '[]'),
      osint: JSON.parse(localStorage.getItem('securecore_osint_jobs') || '[]'),
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `securecore-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export terminé",
      description: "Vos données ont été exportées avec succès."
    });
  };

  const deleteAccount = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible.')) {
      localStorage.clear();
      toast({
        title: "Compte supprimé",
        description: "Toutes vos données ont été effacées.",
        variant: "destructive"
      });
      // Ici vous redirigeriez vers la page de login
    }
  };

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
                checked={settings.notifications}
                onCheckedChange={(value) => updateSetting('notifications', value)}
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
                checked={settings.darkMode}
                onCheckedChange={(value) => updateSetting('darkMode', value)}
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
                checked={settings.autoSave}
                onCheckedChange={(value) => updateSetting('autoSave', value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Langue</Label>
              <Select value={settings.language} onValueChange={(value) => updateSetting('language', value)}>
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
              <Select value={settings.sessionTimeout} onValueChange={(value) => updateSetting('sessionTimeout', value)}>
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
              <Select value={settings.securityLevel} onValueChange={(value) => updateSetting('securityLevel', value)}>
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
            <Button variant="outline" className="w-full glass" onClick={exportData}>
              <Download className="w-4 h-4 mr-2" />
              Exporter mes données
            </Button>

            <Button 
              variant="outline" 
              className="w-full glass border-red-500/30 text-red-400 hover:bg-red-500/10"
              onClick={deleteAccount}
            >
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
              <Select value={settings.theme} onValueChange={(value) => updateSetting('theme', value)}>
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
              <Select value={settings.density} onValueChange={(value) => updateSetting('density', value)}>
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