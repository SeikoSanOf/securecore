// API service layer for backend integration
import { 
  APIResponse, 
  PaginatedResponse,
  LoginRequest, 
  RegisterRequest, 
  User,
  PentestReport,
  PentestScanRequest,
  PasswordEntry,
  PasswordCreateRequest,
  PasswordUpdateRequest,
  Notification,
  DashboardMetric,
  OSINTResult
} from '@/types/api';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class APIService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Authentication
  async login(data: LoginRequest): Promise<APIResponse<{ user: User; token: string }>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async register(data: RegisterRequest): Promise<APIResponse<{ user: User; token: string }>> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async verifyEmail(token: string): Promise<APIResponse<{ verified: boolean }>> {
    return this.request('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async logout(): Promise<APIResponse<{}>> {
    return this.request('/auth/logout', { method: 'POST' });
  }

  async getCurrentUser(): Promise<APIResponse<User>> {
    return this.request('/auth/me');
  }

  // Dashboard
  async getDashboardMetrics(): Promise<APIResponse<DashboardMetric[]>> {
    return this.request('/dashboard/metrics');
  }

  async getDashboardStats(): Promise<APIResponse<{
    total_scans: number;
    active_threats: number;
    passwords_stored: number;
    system_health: number;
    recent_activity: any[];
  }>> {
    return this.request('/dashboard/stats');
  }

  // Pentest
  async getPentestReports(page = 1, limit = 10): Promise<APIResponse<PaginatedResponse<PentestReport>>> {
    return this.request(`/pentest/reports?page=${page}&limit=${limit}`);
  }

  async getPentestReport(id: string): Promise<APIResponse<PentestReport>> {
    return this.request(`/pentest/reports/${id}`);
  }

  async startPentestScan(data: PentestScanRequest): Promise<APIResponse<{ scan_id: string }>> {
    return this.request('/pentest/scan', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async stopPentestScan(scanId: string): Promise<APIResponse<{}>> {
    return this.request(`/pentest/scan/${scanId}/stop`, { method: 'POST' });
  }

  async exportPentestReport(id: string, format: 'json' | 'pdf'): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/pentest/reports/${id}/export?format=${format}`, {
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    });
    return response.blob();
  }

  // Password Manager
  async getPasswords(): Promise<APIResponse<PasswordEntry[]>> {
    return this.request('/passwords');
  }

  async createPassword(data: PasswordCreateRequest): Promise<APIResponse<PasswordEntry>> {
    return this.request('/passwords', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePassword(data: PasswordUpdateRequest): Promise<APIResponse<PasswordEntry>> {
    return this.request(`/passwords/${data.id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePassword(id: string): Promise<APIResponse<{}>> {
    return this.request(`/passwords/${id}`, { method: 'DELETE' });
  }

  async checkPasswordBreach(password: string): Promise<APIResponse<{ breached: boolean; count: number }>> {
    return this.request('/passwords/check-breach', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
  }

  async generatePassword(options: {
    length: number;
    includeUppercase: boolean;
    includeLowercase: boolean;
    includeNumbers: boolean;
    includeSymbols: boolean;
  }): Promise<APIResponse<{ password: string; strength: number }>> {
    return this.request('/passwords/generate', {
      method: 'POST',
      body: JSON.stringify(options),
    });
  }

  // Notifications
  async getNotifications(): Promise<APIResponse<Notification[]>> {
    return this.request('/notifications');
  }

  async markNotificationRead(id: string): Promise<APIResponse<{}>> {
    return this.request(`/notifications/${id}/read`, { method: 'POST' });
  }

  async markAllNotificationsRead(): Promise<APIResponse<{}>> {
    return this.request('/notifications/read-all', { method: 'POST' });
  }

  // OSINT
  async performOSINT(target: string, types: string[]): Promise<APIResponse<{ scan_id: string }>> {
    return this.request('/osint/scan', {
      method: 'POST',
      body: JSON.stringify({ target, types }),
    });
  }

  async getOSINTResults(scanId: string): Promise<APIResponse<OSINTResult[]>> {
    return this.request(`/osint/results/${scanId}`);
  }
}

// Export singleton instance
export const apiService = new APIService();

// Mock data for development - remove when backend is ready
export const mockAPI = {
  // This object contains all the mock implementations
  // that mirror the real API structure for development
  async login(data: LoginRequest) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (data.email && data.password) {
      const mockUser: User = {
        id: '1',
        email: data.email,
        name: data.email.split('@')[0],
        role: data.email.includes('admin') ? 'admin' : 'analyst',
        created_at: new Date().toISOString(),
        email_verified: true,
        last_login: new Date().toISOString()
      };
      
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
  }
  // Add more mock methods as needed for development
};