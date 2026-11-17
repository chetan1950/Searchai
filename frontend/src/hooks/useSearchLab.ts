import { useState, useEffect } from 'react';
import { fetchDashboard } from '../services/api';
import type { DashboardStats } from '../types';

export const useSearchLab = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshStats = async () => {
    setLoading(true);
    try {
      const res = await fetchDashboard();
      setStats(res.statistics);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshStats();
  }, []);

  return { stats, loading, error, refreshStats };
};
