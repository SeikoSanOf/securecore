// API Types for backend integration
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'analyst' | 'user';
  created_at: string;
  email_verified: boolean;
  last_login?: string;
}

export interface PentestReport {
  id: string;
  user_id: string;
  title: string;
  type: 'web_scan' | 'network_scan' | 'ssl_scan' | 'api_scan';
  target: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  findings: Finding[];
  severity_summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
  created_at: string;
  completed_at?: string;
  raw_data?: any;
}

export interface Finding {
  id: string;
  type: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  confidence: number;
  url?: string;
  parameter?: string;
  payload?: string;
  evidence?: string;
  remediation: string;
  references: string[];
  cvss_score?: number;
  cve_id?: string;
}

export interface PasswordEntry {
  id: string;
  user_id: string;
  title: string;
  username: string;
  password: string; // Encrypted in backend
  website?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  last_accessed?: string;
  strength_score: number;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  created_at: string;
  action_url?: string;
}

export interface DashboardMetric {
  id: string;
  user_id: string;
  metric_type: 'scans_remaining' | 'storage_used' | 'threats_detected' | 'passwords_stored';
  value: number;
  max_value?: number;
  updated_at: string;
}

export interface OSINTResult {
  id: string;
  user_id: string;
  target: string;
  type: 'domain' | 'email' | 'ip' | 'social_media';
  source: string;
  data: any;
  confidence: number;
  created_at: string;
}

// API Response types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

// API Request types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface PentestScanRequest {
  type: 'web_scan' | 'network_scan' | 'ssl_scan' | 'api_scan';
  target: string;
  options?: {
    depth?: number;
    aggressive?: boolean;
    include_info?: boolean;
  };
}

export interface PasswordCreateRequest {
  title: string;
  username: string;
  password: string;
  website?: string;
  notes?: string;
}

export interface PasswordUpdateRequest extends Partial<PasswordCreateRequest> {
  id: string;
}