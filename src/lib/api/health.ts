import { config } from '../config/env';

export interface HealthCheckResult {
  isReachable: boolean;
  endpoint: string;
  status?: 'healthy' | 'unhealthy' | 'unknown';
  timestamp?: string;
  uptimeSeconds?: number;
  environment?: string;
  error?: string;
  latencyMs?: number;
}

/**
 * Checks connectivity with the verified backend health probe:
 * Endpoint: GET /api/health (derived from backendBaseUrl + '/api/health')
 *
 * Requirements:
 * - Uses the verified endpoint path '/api/health'
 * - Graceful fallback on unreachable backend
 * - Safe timeout handling
 */
export async function checkBackendHealth(
  timeoutMs = 3000,
  fetchFn: typeof fetch = fetch,
): Promise<HealthCheckResult> {
  const healthEndpoint = `${config.backendBaseUrl}/api/health`;
  const startTime = performance.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const res = await fetchFn(healthEndpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const latencyMs = Math.round(performance.now() - startTime);

    if (!res.ok) {
      return {
        isReachable: false,
        endpoint: healthEndpoint,
        status: 'unhealthy',
        error: `HTTP ${res.status}: ${res.statusText}`,
        latencyMs,
      };
    }

    const json = (await res.json()) as {
      success?: boolean;
      data?: {
        status?: string;
        timestamp?: string;
        uptimeSeconds?: number;
        environment?: string;
      };
    };

    if (json.success && json.data?.status === 'healthy') {
      return {
        isReachable: true,
        endpoint: healthEndpoint,
        status: 'healthy',
        timestamp: json.data.timestamp,
        uptimeSeconds: json.data.uptimeSeconds,
        environment: json.data.environment,
        latencyMs,
      };
    }

    return {
      isReachable: true,
      endpoint: healthEndpoint,
      status: 'unknown',
      latencyMs,
    };
  } catch (err: unknown) {
    const latencyMs = Math.round(performance.now() - startTime);
    const errorMessage = err instanceof Error ? err.message : 'Unknown connection error';

    return {
      isReachable: false,
      endpoint: healthEndpoint,
      status: 'unhealthy',
      error: errorMessage.includes('aborted')
        ? `Request timed out after ${timeoutMs}ms`
        : errorMessage,
      latencyMs,
    };
  }
}
