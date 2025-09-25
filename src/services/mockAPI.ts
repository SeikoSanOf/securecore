// Mock API service for development testing
import type { 
  APIResponse,
  PaginatedResponse,
  LoginRequest,
  RegisterRequest,
  User,
  PentestReport,
  PentestScanRequest,
  PasswordEntry,
  PasswordCreateRequest,
  Notification,
  DashboardMetric,
  OSINTResult
} from '@/types/api';

// Mock data storage (simulates database)
let mockUsers: User[] = [];
let mockReports: PentestReport[] = [];
let mockPasswords: PasswordEntry[] = [];
let mockNotifications: Notification[] = [];
let currentUser: User | null = null;

// Helper to simulate API delay
const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

// Generate mock data
const generateMockData = () => {
  // Mock pentest reports
  mockReports = [
    {
      id: '1',
      user_id: '1',
      title: 'Security Scan - example.com',
      type: 'web_scan',
      target: 'https://example.com',
      status: 'completed',
      findings: [
        {
          id: '1',
          type: 'XSS',
          title: 'Cross-Site Scripting Vulnerability',
          description: 'Reflected XSS found in search parameter',
          severity: 'high',
          confidence: 85,
          url: 'https://example.com/search?q=<script>',
          parameter: 'q',
          payload: '<script>alert(1)</script>',
          evidence: 'Script executed successfully',
          remediation: 'Implement proper input sanitization and output encoding',
          references: ['https://owasp.org/www-community/attacks/xss/'],
          cvss_score: 7.5
        }
      ],
      severity_summary: { critical: 0, high: 1, medium: 2, low: 3, info: 1 },
      created_at: new Date(Date.now() - 86400000).toISOString(),
      completed_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: '2',
      user_id: '1',
      title: 'Network Scan - 192.168.1.0/24',
      type: 'network_scan',
      target: '192.168.1.0/24',
      status: 'running',
      findings: [],
      severity_summary: { critical: 0, high: 0, medium: 0, low: 0, info: 0 },
      created_at: new Date(Date.now() - 1800000).toISOString()
    }
  ];

  // Mock passwords
  mockPasswords = [
    {
      id: '1',
      user_id: '1',
      title: 'Gmail Account',
      username: 'user@example.com',
      password: '•••••••••••••',
      website: 'https://gmail.com',
      notes: 'Primary email account',
      strength_score: 85,
      created_at: new Date(Date.now() - 172800000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString(),
      last_accessed: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: '2',
      user_id: '1',
      title: 'GitHub',
      username: 'developer123',
      password: '•••••••••••••••',
      website: 'https://github.com',
      strength_score: 95,
      created_at: new Date(Date.now() - 259200000).toISOString(),
      updated_at: new Date(Date.now() - 259200000).toISOString()
    }
  ];

  // Mock notifications
  mockNotifications = [
    {
      id: '1',
      user_id: '1',
      title: 'Security Scan Completed',
      message: 'Web scan for example.com has been completed with 7 findings',
      type: 'success',
      read: false,
      created_at: new Date(Date.now() - 3600000).toISOString(),
      action_url: '/pentest-suite'
    },
    {
      id: '2',
      user_id: '1',
      title: 'High Severity Vulnerability Detected',
      message: 'XSS vulnerability found in your latest scan',
      type: 'warning',
      read: false,
      created_at: new Date(Date.now() - 7200000).toISOString()
    },
    {
      id: '3',
      user_id: '1',
      title: 'Welcome to SecureCore',
      message: 'Your account has been successfully created',
      type: 'info',
      read: true,
      created_at: new Date(Date.now() - 86400000).toISOString()
    }
  ];
};

// Initialize mock data
generateMockData();

export const mockAPI = {
  // Authentication
  async login(data: LoginRequest): Promise<APIResponse<{ user: User; token: string }>> {
    await delay();
    
    if (data.email && data.password) {
      const mockUser: User = {
        id: '1',
        email: data.email,
        name: data.email.split('@')[0],
        role: data.email.includes('admin') ? 'admin' : 'analyst',
        created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
        email_verified: true,
        last_login: new Date().toISOString()
      };
      
      currentUser = mockUser;
      const token = 'mock_jwt_token_' + Date.now();
      
      return {
        success: true,
        data: { user: mockUser, token }
      };
    }
    
    return {
      success: false,
      error: 'Invalid credentials'
    };
  },

  async register(data: RegisterRequest): Promise<APIResponse<{ user: User; token: string }>> {
    await delay();
    
    const mockUser: User = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      role: 'user',
      created_at: new Date().toISOString(),
      email_verified: false
    };
    
    mockUsers.push(mockUser);
    currentUser = mockUser;
    
    return {
      success: true,
      data: { user: mockUser, token: 'mock_jwt_token_' + Date.now() }
    };
  },

  async getCurrentUser(): Promise<APIResponse<User>> {
    await delay(300);
    
    if (currentUser) {
      return { success: true, data: currentUser };
    }
    
    return { success: false, error: 'User not authenticated' };
  },

  // Dashboard
  async getDashboardStats(): Promise<APIResponse<{
    total_scans: number;
    active_threats: number;
    passwords_stored: number;
    system_health: number;
    recent_activity: any[];
  }>> {
    await delay(500);
    
    return {
      success: true,
      data: {
        total_scans: 47,
        active_threats: 3,
        passwords_stored: mockPasswords.length,
        system_health: 94,
        recent_activity: [
          { id: 1, type: 'scan_completed', message: 'Web scan completed for example.com', time: '2 hours ago' },
          { id: 2, type: 'vulnerability_found', message: 'High severity XSS detected', time: '3 hours ago' },
          { id: 3, type: 'password_added', message: 'New password entry created', time: '1 day ago' }
        ]
      }
    };
  },

  async getDashboardMetrics(): Promise<APIResponse<DashboardMetric[]>> {
    await delay(400);
    
    return {
      success: true,
      data: [
        { id: '1', user_id: '1', metric_type: 'scans_remaining', value: 23, max_value: 50, updated_at: new Date().toISOString() },
        { id: '2', user_id: '1', metric_type: 'storage_used', value: 75, max_value: 100, updated_at: new Date().toISOString() },
        { id: '3', user_id: '1', metric_type: 'threats_detected', value: 12, updated_at: new Date().toISOString() },
        { id: '4', user_id: '1', metric_type: 'passwords_stored', value: mockPasswords.length, updated_at: new Date().toISOString() }
      ]
    };
  },

  // Pentest
  async getPentestReports(page = 1, limit = 10): Promise<APIResponse<PaginatedResponse<PentestReport>>> {
    await delay(600);
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReports = mockReports.slice(startIndex, endIndex);
    
    return {
      success: true,
      data: {
        data: paginatedReports,
        total: mockReports.length,
        page,
        limit,
        has_more: endIndex < mockReports.length
      }
    };
  },

  async getPentestReport(id: string): Promise<APIResponse<PentestReport>> {
    await delay(400);
    
    const report = mockReports.find(r => r.id === id);
    if (report) {
      return { success: true, data: report };
    }
    
    return { success: false, error: 'Report not found' };
  },

  async startPentestScan(data: PentestScanRequest): Promise<APIResponse<{ scan_id: string }>> {
    await delay(1000);
    
    const newReport: PentestReport = {
      id: Date.now().toString(),
      user_id: '1',
      title: `${data.type.replace('_', ' ')} - ${data.target}`,
      type: data.type,
      target: data.target,
      status: 'pending',
      findings: [],
      severity_summary: { critical: 0, high: 0, medium: 0, low: 0, info: 0 },
      created_at: new Date().toISOString()
    };
    
    mockReports.unshift(newReport);
    
    // Simulate scan progression
    setTimeout(() => {
      newReport.status = 'running';
    }, 2000);
    
    return {
      success: true,
      data: { scan_id: newReport.id }
    };
  },

  // Password Manager
  async getPasswords(): Promise<APIResponse<PasswordEntry[]>> {
    await delay(400);
    
    return {
      success: true,
      data: mockPasswords
    };
  },

  async createPassword(data: PasswordCreateRequest): Promise<APIResponse<PasswordEntry>> {
    await delay(600);
    
    const newPassword: PasswordEntry = {
      id: Date.now().toString(),
      user_id: '1',
      title: data.title,
      username: data.username,
      password: '•••••••••••••',
      website: data.website,
      notes: data.notes,
      strength_score: Math.floor(Math.random() * 40) + 60, // 60-100
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    mockPasswords.unshift(newPassword);
    
    return {
      success: true,
      data: newPassword
    };
  },

  async deletePassword(id: string): Promise<APIResponse<{}>> {
    await delay(400);
    
    const index = mockPasswords.findIndex(p => p.id === id);
    if (index > -1) {
      mockPasswords.splice(index, 1);
      return { success: true, data: {} };
    }
    
    return { success: false, error: 'Password not found' };
  },

  async updatePassword(data: { id: string; title?: string; username?: string; password?: string; website?: string; notes?: string }): Promise<APIResponse<PasswordEntry>> {
    await delay(500);
    
    const password = mockPasswords.find(p => p.id === data.id);
    if (password) {
      Object.assign(password, { 
        ...data, 
        updated_at: new Date().toISOString(),
        strength_score: data.password ? Math.floor(Math.random() * 40) + 60 : password.strength_score
      });
      return { success: true, data: password };
    }
    
    return { success: false, error: 'Password not found' };
  },

  async checkPasswordBreach(password: string): Promise<APIResponse<{ breached: boolean; count: number }>> {
    await delay(800);
    
    // Simulate breach check - mark common passwords as breached
    const commonPasswords = ['password', '123456', 'admin', 'test'];
    const isBreached = commonPasswords.some(p => password.toLowerCase().includes(p));
    
    return {
      success: true,
      data: {
        breached: isBreached,
        count: isBreached ? Math.floor(Math.random() * 10000) + 100 : 0
      }
    };
  },

  async generatePassword(options: any): Promise<APIResponse<{ password: string; strength: number }>> {
    await delay(300);
    
    const chars = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };
    
    let charset = '';
    if (options.includeUppercase) charset += chars.uppercase;
    if (options.includeLowercase) charset += chars.lowercase;
    if (options.includeNumbers) charset += chars.numbers;
    if (options.includeSymbols) charset += chars.symbols;
    
    let password = '';
    for (let i = 0; i < options.length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    const strength = Math.min(100, options.length * 3 + (charset.length > 60 ? 20 : 10));
    
    return {
      success: true,
      data: { password, strength }
    };
  },

  // Notifications
  async getNotifications(): Promise<APIResponse<Notification[]>> {
    await delay(300);
    
    return {
      success: true,
      data: mockNotifications
    };
  },

  async markNotificationRead(id: string): Promise<APIResponse<{}>> {
    await delay(200);
    
    const notification = mockNotifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      return { success: true, data: {} };
    }
    
    return { success: false, error: 'Notification not found' };
  },

  async markAllNotificationsRead(): Promise<APIResponse<{}>> {
    await delay(400);
    
    mockNotifications.forEach(n => n.read = true);
    
    return { success: true, data: {} };
  },

  // Additional auth methods
  async verifyEmail(token: string): Promise<APIResponse<{ verified: boolean }>> {
    await delay(600);
    
    if (currentUser) {
      currentUser.email_verified = true;
      return { success: true, data: { verified: true } };
    }
    
    return { success: false, error: 'Invalid verification token' };
  },

  async logout(): Promise<APIResponse<{}>> {
    await delay(300);
    
    currentUser = null;
    
    return { success: true, data: {} };
  },

  // Additional pentest methods
  async stopPentestScan(scanId: string): Promise<APIResponse<{}>> {
    await delay(500);
    
    const report = mockReports.find(r => r.id === scanId);
    if (report && report.status === 'running') {
      report.status = 'failed';
      return { success: true, data: {} };
    }
    
    return { success: false, error: 'Scan not found or not running' };
  },

  async exportPentestReport(id: string, format: 'json' | 'pdf'): Promise<Blob> {
    await delay(1000);
    
    const report = mockReports.find(r => r.id === id);
    if (!report) {
      throw new Error('Report not found');
    }
    
    const content = format === 'json' 
      ? JSON.stringify(report, null, 2)
      : `PDF Report for ${report.title}\n\nGenerated: ${new Date().toISOString()}`;
    
    return new Blob([content], { 
      type: format === 'json' ? 'application/json' : 'application/pdf' 
    });
  },

  // OSINT methods
  async performOSINT(target: string, types: string[]): Promise<APIResponse<{ scan_id: string }>> {
    await delay(800);
    
    return {
      success: true,
      data: { scan_id: Date.now().toString() }
    };
  },

  async getOSINTResults(scanId: string): Promise<APIResponse<OSINTResult[]>> {
    await delay(600);
    
    const mockResults: OSINTResult[] = [
      {
        id: '1',
        user_id: '1',
        target: 'example.com',
        type: 'domain',
        source: 'whois',
        data: { registrar: 'Example Registrar', created: '2010-01-01' },
        confidence: 95,
        created_at: new Date().toISOString()
      }
    ];
    
    return { success: true, data: mockResults };
  }
};