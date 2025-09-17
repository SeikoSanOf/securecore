import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Bell, AlertTriangle, Shield, Key, Search, Settings, CheckCircle, X, Trash2 } from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'security',
      title: 'Mot de passe faible détecté',
      message: 'Votre mot de passe pour "GitHub" est considéré comme faible. Nous recommandons de le changer.',
      severity: 'high',
      time: '2 minutes',
      read: false,
      category: 'Password Manager'
    },
    {
      id: 2,
      type: 'osint',
      title: 'Nouvelle mention détectée',
      message: 'Votre adresse email a été trouvée dans une nouvelle base de données publique.',
      severity: 'medium',
      time: '15 minutes',
      read: false,
      category: 'OSINT'
    },
    {
      id: 3,
      type: 'pentest',
      title: 'Scan SSL terminé',
      message: 'Le scan SSL de votre domaine example.com est terminé. 3 vulnérabilités détectées.',
      severity: 'high',
      time: '1 heure',
      read: true,
      category: 'Pentest'
    },
    {
      id: 4,
      type: 'system',
      title: 'Sauvegarde automatique',
      message: 'Votre coffre-fort de mots de passe a été sauvegardé avec succès.',
      severity: 'low',
      time: '3 heures',
      read: true,
      category: 'System'
    },
    {
      id: 5,
      type: 'security',
      title: 'Tentative de connexion suspecte',
      message: 'Une tentative de connexion depuis un nouvel appareil a été détectée.',
      severity: 'high',
      time: '1 jour',
      read: false,
      category: 'Security'
    }
  ]);

  const [settings, setSettings] = useState({
    emailNotifications: true,
    desktopNotifications: true,
    securityAlerts: true,
    osintAlerts: true,
    pentestAlerts: true,
    weeklyReports: false
  });

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'security': return <Shield className="w-5 h-5 text-red-400" />;
      case 'osint': return <Search className="w-5 h-5 text-blue-400" />;
      case 'pentest': return <AlertTriangle className="w-5 h-5 text-orange-400" />;
      case 'system': return <Settings className="w-5 h-5 text-green-400" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent flex items-center space-x-3">
            <Bell className="w-8 h-8 text-primary" />
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                {unreadCount} nouvelles
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground mt-2">
            Alertes de sécurité et notifications système
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Tout marquer lu
          </Button>
          <Button className="glass-button">
            <Settings className="w-4 h-4 mr-2" />
            Paramètres
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notifications List */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Alertes récentes</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune notification</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border transition-all ${
                      notification.read 
                        ? 'bg-muted/20 border-white/10' 
                        : 'bg-white/5 border-primary/30 shadow-lg shadow-primary/10'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        {getTypeIcon(notification.type)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium">{notification.title}</h4>
                            <Badge className={getSeverityColor(notification.severity)}>
                              {notification.severity}
                            </Badge>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>{notification.category}</span>
                            <span>•</span>
                            <span>Il y a {notification.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="h-8 w-8 p-0"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Notification Settings */}
        <div>
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Paramètres de notification</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notifications email</p>
                    <p className="text-sm text-muted-foreground">Recevoir par email</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({ ...prev, emailNotifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notifications bureau</p>
                    <p className="text-sm text-muted-foreground">Alertes système</p>
                  </div>
                  <Switch
                    checked={settings.desktopNotifications}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({ ...prev, desktopNotifications: checked }))
                    }
                  />
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <h4 className="font-medium mb-4">Alertes par catégorie</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-red-400" />
                      <span className="text-sm">Sécurité</span>
                    </div>
                    <Switch
                      checked={settings.securityAlerts}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({ ...prev, securityAlerts: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Search className="w-4 h-4 text-blue-400" />
                      <span className="text-sm">OSINT</span>
                    </div>
                    <Switch
                      checked={settings.osintAlerts}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({ ...prev, osintAlerts: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-orange-400" />
                      <span className="text-sm">Pentest</span>
                    </div>
                    <Switch
                      checked={settings.pentestAlerts}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({ ...prev, pentestAlerts: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Rapports hebdomadaires</p>
                    <p className="text-sm text-muted-foreground">Résumé d'activité</p>
                  </div>
                  <Switch
                    checked={settings.weeklyReports}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({ ...prev, weeklyReports: checked }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Notifications;