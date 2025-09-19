import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Network, 
  Search, 
  Shield, 
  Key, 
  Database, 
  Terminal, 
  ExternalLink,
  Play,
  Copy,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface ToolConfig {
  name: string;
  description: string;
  category: 'network' | 'osint' | 'web' | 'auth' | 'exploit' | 'forensics';
  icon: React.ReactNode;
  command: string;
  parameters: {
    name: string;
    label: string;
    type: 'text' | 'number' | 'select' | 'textarea';
    required: boolean;
    options?: string[];
    placeholder?: string;
  }[];
  external_url?: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
}

const AdvancedToolsPanel = () => {
  const [selectedTool, setSelectedTool] = useState<string>('');
  const [toolParams, setToolParams] = useState<Record<string, string>>({});
  const [generatedCommand, setGeneratedCommand] = useState<string>('');
  const [showBreachCheck, setShowBreachCheck] = useState(false);
  const [breachResults, setBreachResults] = useState<any>(null);
  const { toast } = useToast();

  const tools: Record<string, ToolConfig> = {
    // Network Tools
    nmap_advanced: {
      name: 'Nmap Advanced',
      description: 'Professional network discovery and security auditing',
      category: 'network',
      icon: <Network className="w-4 h-4" />,
      command: 'nmap {{flags}} {{target}}',
      risk_level: 'medium',
      parameters: [
        { name: 'target', label: 'Target', type: 'text', required: true, placeholder: '192.168.1.0/24 or example.com' },
        { name: 'scan_type', label: 'Scan Type', type: 'select', required: true, options: ['-sS (TCP SYN)', '-sT (TCP Connect)', '-sU (UDP)', '-sA (ACK)', '-sF (FIN)'] },
        { name: 'timing', label: 'Timing Template', type: 'select', required: false, options: ['-T0 (Paranoid)', '-T1 (Sneaky)', '-T2 (Polite)', '-T3 (Normal)', '-T4 (Aggressive)', '-T5 (Insane)'] },
        { name: 'scripts', label: 'NSE Scripts', type: 'text', required: false, placeholder: 'default,vuln,safe' },
        { name: 'ports', label: 'Port Range', type: 'text', required: false, placeholder: '1-1000 or 80,443,8080' }
      ]
    },

    // OSINT Tools
    spiderfoot: {
      name: 'SpiderFoot OSINT',
      description: 'Automated OSINT collection and analysis',
      category: 'osint',
      icon: <Search className="w-4 h-4" />,
      command: 'spiderfoot -s {{target}} {{modules}}',
      risk_level: 'low',
      external_url: 'https://www.spiderfoot.net/',
      parameters: [
        { name: 'target', label: 'Target Domain/IP', type: 'text', required: true, placeholder: 'example.com' },
        { name: 'modules', label: 'Modules', type: 'select', required: true, options: ['all', 'passive', 'safe', 'custom'] },
        { name: 'output_format', label: 'Output Format', type: 'select', required: false, options: ['json', 'csv', 'xml', 'html'] }
      ]
    },

    recon_ng: {
      name: 'Recon-ng Framework',
      description: 'Modular Python-based OSINT framework',
      category: 'osint',
      icon: <Search className="w-4 h-4" />,
      command: 'recon-ng -w {{workspace}} -m {{module}}',
      risk_level: 'low',
      parameters: [
        { name: 'workspace', label: 'Workspace Name', type: 'text', required: true, placeholder: 'target_assessment' },
        { name: 'module', label: 'Module Path', type: 'select', required: true, options: [
          'recon/domains-hosts/hackertarget',
          'recon/hosts-hosts/resolve',
          'recon/netblocks-hosts/shodan_net',
          'recon/profiles-profiles/namechk'
        ]},
        { name: 'target_domain', label: 'Target Domain', type: 'text', required: true, placeholder: 'example.com' }
      ]
    },

    metagoofil: {
      name: 'Metagoofil',
      description: 'Extract metadata from public documents',
      category: 'osint',
      icon: <Database className="w-4 h-4" />,
      command: 'metagoofil -d {{domain}} -t {{filetypes}} -l {{limit}}',
      risk_level: 'low',
      parameters: [
        { name: 'domain', label: 'Target Domain', type: 'text', required: true, placeholder: 'example.com' },
        { name: 'filetypes', label: 'File Types', type: 'text', required: true, placeholder: 'pdf,doc,xls,ppt,odp,ods,docx,xlsx,pptx' },
        { name: 'limit', label: 'Search Limit', type: 'number', required: false, placeholder: '100' },
        { name: 'download', label: 'Download Files', type: 'select', required: false, options: ['yes', 'no'] }
      ]
    },

    // Web Application Tools
    sqlmap: {
      name: 'SQLMap',
      description: 'Automated SQL injection testing and exploitation',
      category: 'web',
      icon: <Database className="w-4 h-4" />,
      command: 'sqlmap -u "{{url}}" {{options}}',
      risk_level: 'high',
      parameters: [
        { name: 'url', label: 'Target URL', type: 'text', required: true, placeholder: 'http://example.com/login?id=1' },
        { name: 'method', label: 'HTTP Method', type: 'select', required: false, options: ['GET', 'POST', 'PUT', 'DELETE'] },
        { name: 'data', label: 'POST Data', type: 'textarea', required: false, placeholder: 'username=admin&password=test' },
        { name: 'cookie', label: 'Cookies', type: 'text', required: false, placeholder: 'PHPSESSID=abc123' },
        { name: 'risk', label: 'Risk Level', type: 'select', required: false, options: ['1 (Low)', '2 (Medium)', '3 (High)'] },
        { name: 'level', label: 'Test Level', type: 'select', required: false, options: ['1 (Basic)', '2 (Cookie)', '3 (User-Agent)', '4 (Referer)', '5 (Host)'] }
      ]
    },

    // Authentication Tools
    hydra: {
      name: 'Hydra Brute Force',
      description: 'Fast network logon cracker',
      category: 'auth',
      icon: <Key className="w-4 h-4" />,
      command: 'hydra {{options}} {{service}}://{{target}}',
      risk_level: 'critical',
      parameters: [
        { name: 'target', label: 'Target Host', type: 'text', required: true, placeholder: '192.168.1.100' },
        { name: 'service', label: 'Service', type: 'select', required: true, options: ['ssh', 'ftp', 'telnet', 'http-get', 'http-post-form', 'smb'] },
        { name: 'username', label: 'Username/List', type: 'text', required: true, placeholder: 'admin or -L users.txt' },
        { name: 'password', label: 'Password/List', type: 'text', required: true, placeholder: 'password or -P passwords.txt' },
        { name: 'threads', label: 'Parallel Tasks', type: 'number', required: false, placeholder: '16' },
        { name: 'port', label: 'Custom Port', type: 'number', required: false, placeholder: '2222' }
      ]
    },

    medusa: {
      name: 'Medusa Brute Force',
      description: 'Speedy, parallel, modular login brute-forcer',
      category: 'auth',
      icon: <Key className="w-4 h-4" />,
      command: 'medusa -h {{target}} -u {{username}} -p {{password}} -M {{module}}',
      risk_level: 'critical',
      parameters: [
        { name: 'target', label: 'Target Host', type: 'text', required: true, placeholder: '192.168.1.100' },
        { name: 'module', label: 'Service Module', type: 'select', required: true, options: ['ssh', 'ftp', 'telnet', 'http', 'pop3', 'imap', 'smb'] },
        { name: 'username', label: 'Username', type: 'text', required: true, placeholder: 'admin or -U users.txt' },
        { name: 'password', label: 'Password', type: 'text', required: true, placeholder: 'password or -P passwords.txt' },
        { name: 'threads', label: 'Threads', type: 'number', required: false, placeholder: '10' }
      ]
    },

    john: {
      name: 'John the Ripper',
      description: 'Password hash cracking tool',
      category: 'auth',
      icon: <Key className="w-4 h-4" />,
      command: 'john {{options}} {{hashfile}}',
      risk_level: 'medium',
      parameters: [
        { name: 'hashfile', label: 'Hash File Path', type: 'text', required: true, placeholder: '/path/to/hashes.txt' },
        { name: 'wordlist', label: 'Wordlist Path', type: 'text', required: false, placeholder: '/usr/share/wordlists/rockyou.txt' },
        { name: 'format', label: 'Hash Format', type: 'select', required: false, options: ['md5', 'sha1', 'sha256', 'ntlm', 'mysql', 'des'] },
        { name: 'rules', label: 'Mangling Rules', type: 'select', required: false, options: ['wordlist', 'single', 'incremental'] }
      ]
    },

    hashcat: {
      name: 'Hashcat GPU',
      description: 'GPU-accelerated password recovery',
      category: 'auth',
      icon: <Key className="w-4 h-4" />,
      command: 'hashcat -m {{mode}} -a {{attack}} {{hashfile}} {{wordlist}}',
      risk_level: 'medium',
      parameters: [
        { name: 'mode', label: 'Hash Mode', type: 'select', required: true, options: ['0 (MD5)', '100 (SHA1)', '1400 (SHA256)', '1000 (NTLM)', '3200 (bcrypt)'] },
        { name: 'attack', label: 'Attack Mode', type: 'select', required: true, options: ['0 (Dictionary)', '1 (Combinator)', '3 (Brute-force)', '6 (Hybrid Wordlist + Mask)'] },
        { name: 'hashfile', label: 'Hash File', type: 'text', required: true, placeholder: '/path/to/hashes.txt' },
        { name: 'wordlist', label: 'Wordlist', type: 'text', required: false, placeholder: '/usr/share/wordlists/rockyou.txt' },
        { name: 'mask', label: 'Brute-force Mask', type: 'text', required: false, placeholder: '?a?a?a?a?a?a?a?a' }
      ]
    },

    // Exploitation Framework
    metasploit: {
      name: 'Metasploit Framework',
      description: 'Advanced exploitation framework',
      category: 'exploit',
      icon: <Shield className="w-4 h-4" />,
      command: 'msfconsole -q -x "{{commands}}"',
      risk_level: 'critical',
      external_url: 'https://www.metasploit.com/',
      parameters: [
        { name: 'module', label: 'Module Path', type: 'text', required: true, placeholder: 'exploit/multi/handler or auxiliary/scanner/portscan/tcp' },
        { name: 'target', label: 'Target (RHOSTS)', type: 'text', required: true, placeholder: '192.168.1.100' },
        { name: 'port', label: 'Target Port (RPORT)', type: 'number', required: false, placeholder: '80' },
        { name: 'payload', label: 'Payload', type: 'text', required: false, placeholder: 'linux/x86/meterpreter/reverse_tcp' },
        { name: 'lhost', label: 'Local Host (LHOST)', type: 'text', required: false, placeholder: '192.168.1.50' },
        { name: 'lport', label: 'Local Port (LPORT)', type: 'number', required: false, placeholder: '4444' }
      ]
    },

    // Network Analysis
    wireshark: {
      name: 'Wireshark / tcpdump',
      description: 'Network packet capture and analysis',
      category: 'forensics',
      icon: <Network className="w-4 h-4" />,
      command: 'tcpdump {{options}} -w {{output}}',
      risk_level: 'low',
      parameters: [
        { name: 'interface', label: 'Network Interface', type: 'text', required: true, placeholder: 'eth0 or any' },
        { name: 'filter', label: 'BPF Filter', type: 'text', required: false, placeholder: 'host 192.168.1.100 and port 80' },
        { name: 'output', label: 'Output File', type: 'text', required: true, placeholder: 'capture.pcap' },
        { name: 'count', label: 'Packet Count', type: 'number', required: false, placeholder: '1000' },
        { name: 'snaplen', label: 'Snapshot Length', type: 'number', required: false, placeholder: '65535' }
      ]
    }
  };

  const generateCommand = (toolKey: string) => {
    const tool = tools[toolKey];
    if (!tool) return '';

    let command = tool.command;
    const params: Record<string, string> = {};

    // Build parameters object
    tool.parameters.forEach(param => {
      const value = toolParams[param.name] || '';
      params[param.name] = value;
    });

    // Special handling for different tools
    switch (toolKey) {
      case 'nmap_advanced':
        const flags = [];
        if (params.scan_type) flags.push(params.scan_type.split(' ')[0]);
        if (params.timing) flags.push(params.timing.split(' ')[0]);
        if (params.scripts) flags.push(`--script=${params.scripts}`);
        if (params.ports) flags.push(`-p ${params.ports}`);
        command = command.replace('{{flags}}', flags.join(' '));
        break;
        
      case 'sqlmap':
        const options = [];
        if (params.method && params.method !== 'GET') options.push(`--method=${params.method}`);
        if (params.data) options.push(`--data="${params.data}"`);
        if (params.cookie) options.push(`--cookie="${params.cookie}"`);
        if (params.risk) options.push(`--risk=${params.risk.charAt(0)}`);
        if (params.level) options.push(`--level=${params.level.charAt(0)}`);
        options.push('--batch');
        command = command.replace('{{options}}', options.join(' '));
        break;
        
      case 'hydra':
        const hydraOptions = [];
        const username = params.username.startsWith('-') ? params.username : `-l ${params.username}`;
        const password = params.password.startsWith('-') ? params.password : `-p ${params.password}`;
        hydraOptions.push(username, password);
        if (params.threads) hydraOptions.push(`-t ${params.threads}`);
        if (params.port) hydraOptions.push(`-s ${params.port}`);
        command = command.replace('{{options}}', hydraOptions.join(' '));
        break;
        
      case 'metasploit':
        const msfCommands = [
          `use ${params.module}`,
          `set RHOSTS ${params.target}`
        ];
        if (params.port) msfCommands.push(`set RPORT ${params.port}`);
        if (params.payload) msfCommands.push(`set PAYLOAD ${params.payload}`);
        if (params.lhost) msfCommands.push(`set LHOST ${params.lhost}`);
        if (params.lport) msfCommands.push(`set LPORT ${params.lport}`);
        msfCommands.push('run');
        command = command.replace('{{commands}}', msfCommands.join('; '));
        break;
        
      case 'wireshark':
        const tcpdumpOptions = [];
        tcpdumpOptions.push(`-i ${params.interface}`);
        if (params.snaplen) tcpdumpOptions.push(`-s ${params.snaplen}`);
        if (params.count) tcpdumpOptions.push(`-c ${params.count}`);
        if (params.filter) tcpdumpOptions.push(`'${params.filter}'`);
        command = command.replace('{{options}}', tcpdumpOptions.join(' '));
        break;
    }

    // Replace remaining placeholders
    Object.entries(params).forEach(([key, value]) => {
      command = command.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });

    return command;
  };

  const handleParameterChange = (paramName: string, value: string) => {
    const updated = { ...toolParams, [paramName]: value };
    setToolParams(updated);
    
    if (selectedTool) {
      const cmd = generateCommand(selectedTool);
      setGeneratedCommand(cmd);
    }
  };

  const copyCommand = () => {
    navigator.clipboard.writeText(generatedCommand);
    toast({
      title: "Command Copied",
      description: "Command copied to clipboard successfully"
    });
  };

  const checkBreachedPasswords = async () => {
    // Simulated breach check - in real implementation, integrate with HaveIBeenPwned API
    setShowBreachCheck(true);
    
    // Mock results
    setTimeout(() => {
      setBreachResults({
        domain: toolParams.target || 'example.com',
        breaches: [
          { name: 'Adobe', date: '2013-10-04', pwn_count: 152445165 },
          { name: 'LinkedIn', date: '2012-05-05', pwn_count: 164611595 }
        ],
        pastes: [
          { source: 'Pastebin', date: '2019-03-02', title: 'Email dump #1' }
        ]
      });
    }, 2000);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default: return 'bg-green-500/10 text-green-500 border-green-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-cyber-red" />
            <span>Advanced Security Tools</span>
          </CardTitle>
          <CardDescription>
            Professional penetration testing and security assessment tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              These tools are for authorized security testing only. Ensure proper authorization 
              and legal compliance before use. Some tools carry significant legal and ethical risks.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="tools" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tools">Tools</TabsTrigger>
              <TabsTrigger value="command">Command Builder</TabsTrigger>
              <TabsTrigger value="breach">Breach Check</TabsTrigger>
            </TabsList>

            <TabsContent value="tools" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(tools).map(([key, tool]) => (
                  <Card key={key} className={`cursor-pointer transition-all ${selectedTool === key ? 'ring-2 ring-primary' : ''}`}
                        onClick={() => setSelectedTool(key)}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {tool.icon}
                          <CardTitle className="text-sm">{tool.name}</CardTitle>
                        </div>
                        <Badge className={getRiskColor(tool.risk_level)}>
                          {tool.risk_level}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs">{tool.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Badge variant="outline" className="text-xs">
                        {tool.category}
                      </Badge>
                      {tool.external_url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(tool.external_url, '_blank');
                          }}
                          className="mt-2 h-6 px-2 text-xs"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Docs
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="command" className="space-y-4">
              {selectedTool ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    {tools[selectedTool].icon}
                    <h3 className="text-lg font-semibold">{tools[selectedTool].name}</h3>
                    <Badge className={getRiskColor(tools[selectedTool].risk_level)}>
                      {tools[selectedTool].risk_level}
                    </Badge>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    {tools[selectedTool].parameters.map((param) => (
                      <div key={param.name} className="space-y-2">
                        <Label htmlFor={param.name}>
                          {param.label} {param.required && '*'}
                        </Label>
                        {param.type === 'select' ? (
                          <select
                            id={param.name}
                            className="w-full p-2 border rounded-md bg-background"
                            value={toolParams[param.name] || ''}
                            onChange={(e) => handleParameterChange(param.name, e.target.value)}
                          >
                            <option value="">Select {param.label}</option>
                            {param.options?.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : param.type === 'textarea' ? (
                          <Textarea
                            id={param.name}
                            placeholder={param.placeholder}
                            value={toolParams[param.name] || ''}
                            onChange={(e) => handleParameterChange(param.name, e.target.value)}
                          />
                        ) : (
                          <Input
                            id={param.name}
                            type={param.type}
                            placeholder={param.placeholder}
                            value={toolParams[param.name] || ''}
                            onChange={(e) => handleParameterChange(param.name, e.target.value)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {generatedCommand && (
                    <div className="space-y-2">
                      <Label>Generated Command:</Label>
                      <div className="relative">
                        <Textarea
                          value={generatedCommand}
                          readOnly
                          className="font-mono text-sm bg-muted/50"
                          rows={3}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-2 right-2"
                          onClick={copyCommand}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Terminal className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Select a Tool</h3>
                  <p className="text-muted-foreground">
                    Choose a security tool from the Tools tab to build commands
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="breach" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    <span>Credential Breach Analysis</span>
                  </CardTitle>
                  <CardDescription>
                    Check if domain/email addresses have been compromised in data breaches
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="breach-target">Target Domain/Email</Label>
                      <Input
                        id="breach-target"
                        placeholder="example.com or user@example.com"
                        value={toolParams.target || ''}
                        onChange={(e) => handleParameterChange('target', e.target.value)}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button onClick={checkBreachedPasswords} disabled={!toolParams.target}>
                        <Search className="w-4 h-4 mr-2" />
                        Check Breaches
                      </Button>
                    </div>
                  </div>

                  {showBreachCheck && (
                    <div className="space-y-4">
                      {!breachResults ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          <span>Checking breach databases...</span>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Alert>
                            <CheckCircle className="h-4 w-4" />
                            <AlertDescription>
                              Analysis complete for {breachResults.domain}
                            </AlertDescription>
                          </Alert>

                          {breachResults.breaches.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2 text-red-600">Data Breaches Found:</h4>
                              <div className="space-y-2">
                                {breachResults.breaches.map((breach: any, index: number) => (
                                  <div key={index} className="border rounded p-3">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h5 className="font-medium">{breach.name}</h5>
                                        <p className="text-sm text-muted-foreground">
                                          Date: {breach.date}
                                        </p>
                                      </div>
                                      <Badge variant="destructive">
                                        {breach.pwn_count.toLocaleString()} accounts
                                      </Badge>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {breachResults.pastes.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2 text-orange-600">Paste Sites Found:</h4>
                              <div className="space-y-2">
                                {breachResults.pastes.map((paste: any, index: number) => (
                                  <div key={index} className="border rounded p-3">
                                    <h5 className="font-medium">{paste.title}</h5>
                                    <p className="text-sm text-muted-foreground">
                                      Source: {paste.source} | Date: {paste.date}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedToolsPanel;