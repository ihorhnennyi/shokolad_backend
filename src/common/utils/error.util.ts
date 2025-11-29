export interface NormalizedError {
  status: number;
  message: string;
  timestamp: string;
  path?: string;
  details?: any;
}

export const normalizeError = (error: any, path?: string): NormalizedError => {
  const status = error?.status ?? 500;

  const message = error?.response?.message || error?.message || 'Internal server error';

  const details = typeof error?.response === 'object' ? error.response : undefined;

  return {
    status,
    message,
    path,
    details,
    timestamp: new Date().toISOString(),
  };
};
