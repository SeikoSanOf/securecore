// Custom hooks for API integration
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import type { 
  PentestReport, 
  PasswordEntry, 
  Notification, 
  DashboardMetric,
  PentestScanRequest,
  PasswordCreateRequest 
} from '@/types/api';

// Dashboard hooks
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => apiService.getDashboardStats(),
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};

export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: () => apiService.getDashboardMetrics(),
    refetchInterval: 60000, // Refresh every minute
  });
};

// Pentest hooks
export const usePentestReports = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['pentest-reports', page, limit],
    queryFn: () => apiService.getPentestReports(page, limit),
  });
};

export const usePentestReport = (id: string) => {
  return useQuery({
    queryKey: ['pentest-report', id],
    queryFn: () => apiService.getPentestReport(id),
    enabled: !!id,
  });
};

export const useStartPentestScan = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PentestScanRequest) => apiService.startPentestScan(data),
    onSuccess: () => {
      toast({
        title: "Scan Started",
        description: "Penetration test scan has been initiated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['pentest-reports'] });
    },
    onError: (error: any) => {
      toast({
        title: "Scan Failed",
        description: error?.message || "Failed to start penetration test scan.",
        variant: "destructive",
      });
    },
  });
};

// Password Manager hooks
export const usePasswords = () => {
  return useQuery({
    queryKey: ['passwords'],
    queryFn: () => apiService.getPasswords(),
  });
};

export const useCreatePassword = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PasswordCreateRequest) => apiService.createPassword(data),
    onSuccess: () => {
      toast({
        title: "Password Saved",
        description: "Password has been securely stored.",
      });
      queryClient.invalidateQueries({ queryKey: ['passwords'] });
    },
    onError: (error: any) => {
      toast({
        title: "Save Failed",
        description: error?.message || "Failed to save password.",
        variant: "destructive",
      });
    },
  });
};

export const useDeletePassword = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiService.deletePassword(id),
    onSuccess: () => {
      toast({
        title: "Password Deleted",
        description: "Password has been permanently removed.",
      });
      queryClient.invalidateQueries({ queryKey: ['passwords'] });
    },
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: error?.message || "Failed to delete password.",
        variant: "destructive",
      });
    },
  });
};

export const useGeneratePassword = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (options: {
      length: number;
      includeUppercase: boolean;
      includeLowercase: boolean;
      includeNumbers: boolean;
      includeSymbols: boolean;
    }) => apiService.generatePassword(options),
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error?.message || "Failed to generate password.",
        variant: "destructive",
      });
    },
  });
};

// Notifications hooks
export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => apiService.getNotifications(),
    refetchInterval: 30000, // Check for new notifications every 30 seconds
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiService.markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiService.markAllNotificationsRead(),
    onSuccess: () => {
      toast({
        title: "Notifications Cleared",
        description: "All notifications have been marked as read.",
      });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

// Generic loading hook for API states
export const useAsyncOperation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async <T>(operation: () => Promise<T>): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await operation();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, execute };
};

// Real-time updates hook (would use WebSocket in production)
export const useRealTimeUpdates = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // In production, this would establish a WebSocket connection
    // For now, we'll use polling for critical data
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['pentest-reports'] });
    }, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, [queryClient]);
};