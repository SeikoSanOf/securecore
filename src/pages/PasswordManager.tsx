import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Lock, 
  Plus, 
  Copy, 
  Eye, 
  EyeOff, 
  Trash2, 
  RefreshCw,
  Download,
  Upload,
  Shield
} from 'lucide-react';

interface PasswordEntry {
  id: string;
  title: string;
  username: string;
  password: string;
  website?: string;
  createdAt: Date;
}

const PasswordManager = () => {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isAddingPassword, setIsAddingPassword] = useState(false);
  const { toast } = useToast();

  // Generator settings
  const [length, setLength] = useState([16]);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');

  // Form data
  const [newEntry, setNewEntry] = useState({
    title: '',
    username: '',
    password: '',
    website: ''
  });

  useEffect(() => {
    // Load passwords from localStorage
    const storedPasswords = localStorage.getItem('securecore_passwords');
    if (storedPasswords) {
      const parsed = JSON.parse(storedPasswords);
      setPasswords(parsed.map((p: any) => ({ ...p, createdAt: new Date(p.createdAt) })));
    }
  }, []);

  const savePasswords = (newPasswords: PasswordEntry[]) => {
    localStorage.setItem('securecore_passwords', JSON.stringify(newPasswords));
    setPasswords(newPasswords);
  };

  const generatePassword = () => {
    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!charset) {
      toast({
        title: "Error",
        description: "Please select at least one character type",
        variant: "destructive"
      });
      return;
    }

    let password = '';
    for (let i = 0; i < length[0]; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    setGeneratedPassword(password);
  };

  const copyToClipboard = (text: string, label: string = 'Text') => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const addPassword = () => {
    if (!newEntry.title || !newEntry.username || !newEntry.password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const entry: PasswordEntry = {
      id: Math.random().toString(36),
      ...newEntry,
      createdAt: new Date()
    };

    const updatedPasswords = [...passwords, entry];
    savePasswords(updatedPasswords);
    
    setNewEntry({ title: '', username: '', password: '', website: '' });
    setIsAddingPassword(false);

    toast({
      title: "Password Added",
      description: "New password entry has been encrypted and stored",
    });
  };

  const deletePassword = (id: string) => {
    const updatedPasswords = passwords.filter(p => p.id !== id);
    savePasswords(updatedPasswords);
    
    toast({
      title: "Password Deleted",
      description: "Password entry has been permanently removed",
    });
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const exportData = () => {
    const data = JSON.stringify(passwords, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `securecore-passwords-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Password vault exported successfully",
    });
  };

  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score < 3) return { level: 'Weak', color: 'text-cyber-red' };
    if (score < 5) return { level: 'Medium', color: 'text-cyber-orange' };
    return { level: 'Strong', color: 'text-cyber-green' };
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold flex items-center space-x-2">
            <Lock className="w-8 h-8 text-cyber-orange" />
            <span>Password Manager</span>
          </h1>
          <p className="text-muted-foreground">Secure credential storage and generation</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Dialog open={isGeneratorOpen} onOpenChange={setIsGeneratorOpen}>
            <DialogTrigger asChild>
              <Button>
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Password Generator</DialogTitle>
                <DialogDescription>
                  Create a secure password with custom settings
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Length: {length[0]}</Label>
                  <Slider
                    value={length}
                    onValueChange={setLength}
                    max={64}
                    min={4}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="uppercase"
                      checked={includeUppercase}
                      onCheckedChange={setIncludeUppercase}
                    />
                    <Label htmlFor="uppercase">Uppercase</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="lowercase"
                      checked={includeLowercase}
                      onCheckedChange={setIncludeLowercase}
                    />
                    <Label htmlFor="lowercase">Lowercase</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="numbers"
                      checked={includeNumbers}
                      onCheckedChange={setIncludeNumbers}
                    />
                    <Label htmlFor="numbers">Numbers</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="symbols"
                      checked={includeSymbols}
                      onCheckedChange={setIncludeSymbols}
                    />
                    <Label htmlFor="symbols">Symbols</Label>
                  </div>
                </div>

                <Button onClick={generatePassword} className="w-full">
                  Generate Password
                </Button>

                {generatedPassword && (
                  <div className="space-y-2">
                    <Label>Generated Password</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        value={generatedPassword}
                        readOnly
                        className="font-mono"
                      />
                      <Button
                        size="sm"
                        onClick={() => copyToClipboard(generatedPassword, 'Password')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4" />
                      <span className="text-sm">Strength:</span>
                      <Badge className={getPasswordStrength(generatedPassword).color}>
                        {getPasswordStrength(generatedPassword).level}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isAddingPassword} onOpenChange={setIsAddingPassword}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Password
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Password</DialogTitle>
                <DialogDescription>
                  Store a new password entry in your encrypted vault
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Gmail Account"
                    value={newEntry.title}
                    onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    placeholder="e.g., https://gmail.com"
                    value={newEntry.website}
                    onChange={(e) => setNewEntry({...newEntry, website: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    placeholder="e.g., user@example.com"
                    value={newEntry.username}
                    onChange={(e) => setNewEntry({...newEntry, username: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter password"
                      value={newEntry.password}
                      onChange={(e) => setNewEntry({...newEntry, password: e.target.value})}
                    />
                    {generatedPassword && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setNewEntry({...newEntry, password: generatedPassword})}
                      >
                        Use Generated
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddingPassword(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addPassword}>Add Password</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Passwords</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyber-orange">{passwords.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Strong Passwords</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyber-green">
              {passwords.filter(p => getPasswordStrength(p.password).level === 'Strong').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Weak Passwords</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyber-red">
              {passwords.filter(p => getPasswordStrength(p.password).level === 'Weak').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Password List */}
      <Card>
        <CardHeader>
          <CardTitle>Stored Passwords</CardTitle>
          <CardDescription>Your encrypted password vault</CardDescription>
        </CardHeader>
        <CardContent>
          {passwords.length === 0 ? (
            <div className="text-center py-8">
              <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No passwords stored</h3>
              <p className="text-muted-foreground mb-4">Start by adding your first password entry</p>
              <Button onClick={() => setIsAddingPassword(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Password
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {passwords.map((entry) => {
                const strength = getPasswordStrength(entry.password);
                return (
                  <div key={entry.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{entry.title}</h3>
                        <p className="text-sm text-muted-foreground font-mono">{entry.username}</p>
                        {entry.website && (
                          <p className="text-sm text-cyber-blue">{entry.website}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={strength.color}>{strength.level}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePasswordVisibility(entry.id)}
                        >
                          {showPasswords[entry.id] ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(entry.password, 'Password')}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deletePassword(entry.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">Password:</span>
                      <code className="font-mono text-sm bg-muted px-2 py-1 rounded">
                        {showPasswords[entry.id] ? entry.password : '••••••••••••'}
                      </code>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Created: {entry.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordManager;