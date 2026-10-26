import { apiFetch } from './client';
import type { AiAssistanceRequest, AiAssistanceResponse } from './types';

/**
 * Requests AI-assisted feedback polishing for authenticated business owners.
 * Supports fix_grammar, improve_clarity, make_concise, and professional_tone actions.
 * Preserves truthfulness, sentiment, and core facts without persisting to database.
 */
export async function requestAiAssistance(
  payload: AiAssistanceRequest,
  fetchFn?: typeof fetch,
): Promise<AiAssistanceResponse> {
  return apiFetch<AiAssistanceResponse>(
    '/feedback/ai-assistance',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    fetchFn,
  );
}
