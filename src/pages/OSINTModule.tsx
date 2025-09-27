import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Plus, 
  Download, 
  Eye, 
  Play, 
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Database
} from 'lucide-react';

interface OSINTJob {
  id: string;
  title: string;
  source: string;
  target: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
  results?: any;
}

const osintSources = [
  { id: 'social_media', name: 'Réseaux Sociaux', description: 'Facebook, Twitter, LinkedIn, Instagram profiles' },
  { id: 'domain_info', name: 'Informations Domaine', description: 'WHOIS, DNS, sous-domaines, certificats' },
  { id: 'email_search', name: 'Recherche Email', description: 'Validation, breaches, metadata SMTP' },
  { id: 'phone_search', name: 'Recherche Téléphone', description: 'Opérateur, localisation, validité' },
  { id: 'username_search', name: 'Recherche Username', description: 'Présence sur plateformes multiples' },
  { id: 'ip_geolocation', name: 'Géolocalisation IP', description: 'Localisation, FAI, services exposés' },
  { id: 'dark_web', name: 'Dark Web', description: 'Recherche dans bases de données compromises' },
  { id: 'company_info', name: 'Informations Entreprise', description: 'Employés, technologies, financements' },
];

const OSINTModule = () => {
  const [jobs, setJobs] = useState<OSINTJob[]>([]);
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [selectedJob, setSelectedJob] = useState<OSINTJob | null>(null);
  const { toast } = useToast();

  const [newJob, setNewJob] = useState({
    title: '',
    source: '',
    target: ''
  });

  useEffect(() => {
    // Load jobs from localStorage
    const storedJobs = localStorage.getItem('securecore_osint_jobs');
    if (storedJobs) {
      const parsed = JSON.parse(storedJobs);
      setJobs(parsed.map((j: any) => ({ 
        ...j, 
        createdAt: new Date(j.createdAt),
        completedAt: j.completedAt ? new Date(j.completedAt) : undefined
      })));
    }
  }, []);

  const saveJobs = (newJobs: OSINTJob[]) => {
    localStorage.setItem('securecore_osint_jobs', JSON.stringify(newJobs));
    setJobs(newJobs);
  };

  const createJob = () => {
    if (!newJob.title || !newJob.source || !newJob.target) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const job: OSINTJob = {
      id: Math.random().toString(36),
      ...newJob,
      status: 'pending',
      createdAt: new Date()
    };

    const updatedJobs = [job, ...jobs];
    saveJobs(updatedJobs);
    
    setNewJob({ title: '', source: '', target: '' });
    setIsCreatingJob(false);

    // Simulate job execution
    setTimeout(() => runJob(job.id), 1000);

    toast({
      title: "OSINT Job Created",
      description: "Intelligence gathering task has been queued",
    });
  };

  const runJob = (jobId: string) => {
    const jobIndex = jobs.findIndex(j => j.id === jobId);
    if (jobIndex === -1) return;

    // Update to running
    const runningJobs = [...jobs];
    runningJobs[jobIndex] = { ...runningJobs[jobIndex], status: 'running' };
    saveJobs(runningJobs);

    // Simulate completion after random time
    setTimeout(() => {
      const completedJobs = [...jobs];
      const job = completedJobs[jobIndex];
      
      // Generate mock results based on source type
      const mockResults = generateMockResults(job.source, job.target);
      
      completedJobs[jobIndex] = { 
        ...job, 
        status: 'completed',
        completedAt: new Date(),
        results: mockResults
      };
      
      saveJobs(completedJobs);
      
      toast({
        title: "OSINT Job Completed",
        description: `Intelligence gathering for "${job.title}" has finished`,
      });
    }, Math.random() * 5000 + 3000);
  };

  const generateMockResults = (source: string, target: string) => {
    switch (source) {
      case 'domain_info':
        return {
          domain: target,
          registrar: 'GoDaddy LLC',
          creationDate: '2020-03-15T12:00:00Z',
          expirationDate: '2025-03-15T12:00:00Z',
          nameServers: ['ns1.cloudflare.com', 'ns2.cloudflare.com'],
          dnsRecords: {
            A: ['104.21.45.67', '172.67.200.123'],
            AAAA: ['2606:4700:3036::6815:2d43'],
            MX: ['mail.protonmail.ch', 'mailsec.protonmail.ch'],
            TXT: ['v=spf1 include:_spf.protonmail.ch ~all', 'v=DMARC1; p=quarantine;'],
            CNAME: ['www.example.com']
          },
          subdomains: ['mail', 'admin', 'api', 'cdn', 'blog'],
          ssl_info: {
            issuer: 'Let\'s Encrypt Authority X3',
            valid_from: '2024-01-15',
            valid_to: '2024-04-15',
            signature_algorithm: 'SHA256withRSA'
          }
        };
      case 'email_search':
        return {
          email: target,
          isValid: true,
          deliverable: true,
          breaches: [
            { name: 'Adobe 2013', date: '2013-10-04', compromised_accounts: '152M' },
            { name: 'LinkedIn 2012', date: '2012-06-05', compromised_accounts: '117M' },
            { name: 'Collection #1', date: '2019-01-16', compromised_accounts: '773M' }
          ],
          socialProfiles: {
            linkedin: 'https://linkedin.com/in/johndoe',
            twitter: '@johndoe_sec',
            github: 'github.com/johndoe'
          },
          domain_info: {
            domain: target.split('@')[1],
            mx_records: ['mail.google.com', 'alt1.gmail-smtp-in.l.google.com'],
            spf_record: 'v=spf1 include:_spf.google.com ~all'
          }
        };
      case 'social_media':
        return {
          platforms_found: [
            { platform: 'LinkedIn', url: `https://linkedin.com/in/${target}`, verified: true },
            { platform: 'Twitter', url: `https://twitter.com/${target}`, verified: true },
            { platform: 'Instagram', url: `https://instagram.com/${target}`, verified: false },
            { platform: 'GitHub', url: `https://github.com/${target}`, verified: true }
          ],
          profile_data: {
            name: 'John Doe',
            location: 'San Francisco, CA',
            company: 'TechCorp Inc.',
            job_title: 'Security Engineer',
            connections: 500,
            followers: 1200
          }
        };
      case 'ip_geolocation':
        return {
          ip: target,
          country: 'United States',
          country_code: 'US',
          region: 'California',
          city: 'San Francisco',
          isp: 'Cloudflare, Inc.',
          organization: 'Cloudflare',
          timezone: 'America/Los_Angeles',
          latitude: 37.7749,
          longitude: -122.4194,
          asn: 'AS13335',
          threat_intelligence: {
            malicious: false,
            reputation: 'good',
            last_seen: null
          },
          open_ports: [80, 443, 22],
          services: ['HTTP/HTTPS', 'SSH']
        };
      case 'phone_search':
        return {
          phone: target,
          valid: true,
          type: 'mobile',
          carrier: 'Verizon Wireless',
          country: 'United States',
          region: 'California',
          timezone: 'Pacific',
          ported: false,
          social_media: ['WhatsApp', 'Telegram'],
          recent_activity: '2024-01-15'
        };
      case 'username_search':
        return {
          username: target,
          platforms_found: 15,
          platforms: [
            { name: 'Twitter', url: `https://twitter.com/${target}`, status: 'confirmed' },
            { name: 'Instagram', url: `https://instagram.com/${target}`, status: 'confirmed' },
            { name: 'GitHub', url: `https://github.com/${target}`, status: 'confirmed' },
            { name: 'Reddit', url: `https://reddit.com/u/${target}`, status: 'probable' },
            { name: 'YouTube', url: `https://youtube.com/@${target}`, status: 'probable' }
          ],
          last_activity: '2024-01-10'
        };
      case 'dark_web':
        return {
          target: target,
          breaches_found: 3,
          credentials: [
            { username: target, password: '[REDACTED]', source: 'Collection #1', date: '2019-01-16' },
            { username: target, password: '[REDACTED]', source: 'Exploit.in Combo', date: '2020-03-22' }
          ],
          mentions: 2,
          forums: ['RaidForums', 'BreachForums'],
          last_seen: '2023-12-15'
        };
      case 'company_info':
        return {
          company: target,
          employees: {
            total_found: 156,
            departments: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'],
            key_personnel: [
              { name: 'John Smith', title: 'CTO', linkedin: 'linkedin.com/in/johnsmith' },
              { name: 'Jane Doe', title: 'CISO', linkedin: 'linkedin.com/in/janedoe' }
            ]
          },
          technologies: ['AWS', 'Docker', 'React', 'Node.js', 'PostgreSQL'],
          funding: '$50M Series B (2023)',
          locations: ['San Francisco', 'New York', 'Austin']
        };
      default:
        return {
          target: target,
          found: Math.random() > 0.3,
          profiles: Math.floor(Math.random() * 5) + 1,
          confidence: Math.floor(Math.random() * 40) + 60,
          lastSeen: new Date().toISOString(),
          data_sources: ['Public Records', 'Social Media', 'Web Scraping']
        };
    }
  };

  const exportResults = (job: OSINTJob) => {
    if (!job.results) return;
    
    const data = JSON.stringify({
      job: {
        title: job.title,
        source: job.source,
        target: job.target,
        createdAt: job.createdAt,
        completedAt: job.completedAt
      },
      results: job.results
    }, null, 2);
    
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `osint-${job.title.replace(/\s+/g, '-')}-${job.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "OSINT results exported successfully",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-cyber-green" />;
      case 'running':
        return <div className="w-4 h-4 border-2 border-cyber-blue border-t-transparent rounded-full animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-cyber-red" />;
      default:
        return <Clock className="w-4 h-4 text-cyber-orange" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-cyber-green';
      case 'running':
        return 'text-cyber-blue';
      case 'failed':
        return 'text-cyber-red';
      default:
        return 'text-cyber-orange';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold flex items-center space-x-2">
            <Search className="w-8 h-8 text-cyber-blue" />
            <span>OSINT Intelligence</span>
          </h1>
          <p className="text-muted-foreground">Open Source Intelligence gathering and analysis</p>
        </div>
        <Dialog open={isCreatingJob} onOpenChange={setIsCreatingJob}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Search
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create OSINT Job</DialogTitle>
              <DialogDescription>
                Start a new intelligence gathering operation
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="job-title">Job Title *</Label>
                <Input
                  id="job-title"
                  placeholder="e.g., Target Company Investigation"
                  value={newJob.title}
                  onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="source-type">Source Type *</Label>
                <Select value={newJob.source} onValueChange={(value) => setNewJob({...newJob, source: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select intelligence source" />
                  </SelectTrigger>
                  <SelectContent>
                    {osintSources.map((source) => (
                      <SelectItem key={source.id} value={source.id}>
                        <div className="flex flex-col">
                          <span>{source.name}</span>
                          <span className="text-xs text-muted-foreground">{source.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="target">Target *</Label>
                <Input
                  id="target"
                  placeholder="e.g., example.com, user@example.com, +1234567890"
                  value={newJob.target}
                  onChange={(e) => setNewJob({...newJob, target: e.target.value})}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreatingJob(false)}>
                  Cancel
                </Button>
                <Button onClick={createJob}>Create Job</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyber-blue">{jobs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyber-green">
              {jobs.filter(j => j.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Running</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyber-orange">
              {jobs.filter(j => j.status === 'running').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-muted-foreground">
              {jobs.filter(j => j.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs List */}
      <Card>
        <CardHeader>
          <CardTitle>Intelligence Operations</CardTitle>
          <CardDescription>Current and completed OSINT jobs</CardDescription>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <div className="text-center py-8">
              <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No OSINT jobs yet</h3>
              <p className="text-muted-foreground mb-4">Create your first intelligence gathering operation</p>
              <Button onClick={() => setIsCreatingJob(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Job
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{job.title}</h3>
                        <Badge className={getStatusColor(job.status)}>
                          {job.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Target: <span className="font-mono">{job.target}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Source: {osintSources.find(s => s.id === job.source)?.name || job.source}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(job.status)}
                      {job.status === 'completed' && job.results && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedJob(job)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => exportResults(job)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      {job.status === 'pending' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => runJob(job.id)}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Created: {job.createdAt.toLocaleString()}</span>
                    {job.completedAt && (
                      <span>Completed: {job.completedAt.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Dialog */}
      <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>OSINT Results: {selectedJob?.title}</DialogTitle>
            <DialogDescription>
              Intelligence data collected for {selectedJob?.target}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedJob?.results && (
              <div className="space-y-3">
                <div className="font-mono text-sm bg-terminal-bg text-terminal-text p-4 rounded-lg overflow-auto max-h-96">
                  <pre>{JSON.stringify(selectedJob.results, null, 2)}</pre>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => exportResults(selectedJob)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Results
                  </Button>
                  <Button onClick={() => setSelectedJob(null)}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OSINTModule;