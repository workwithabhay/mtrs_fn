import { describe, it, expect, vi, beforeEach } from 'vitest';
import { requestAiAssistance } from '@/lib/api/ai-studio';
import * as client from '@/lib/api/client';

describe('AI Studio API Client', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('calls POST /feedback/ai-assistance with draftText and action', async () => {
    const apiFetchSpy = vi.spyOn(client, 'apiFetch').mockResolvedValue({
      originalDraft: 'the soup was lukewarm and service was slow',
      suggestedText: 'The soup was lukewarm and service was slow.',
      mode: 'fix_grammar',
    });

    const result = await requestAiAssistance({
      draftText: 'the soup was lukewarm and service was slow',
      action: 'fix_grammar',
    });

    expect(apiFetchSpy).toHaveBeenCalledWith(
      '/feedback/ai-assistance',
      {
        method: 'POST',
        body: JSON.stringify({
          draftText: 'the soup was lukewarm and service was slow',
          action: 'fix_grammar',
        }),
      },
      undefined,
    );

    expect(result.suggestedText).toBe('The soup was lukewarm and service was slow.');
    expect(result.mode).toBe('fix_grammar');
  });

  it('propagates ApiError when server returns an error', async () => {
    vi.spyOn(client, 'apiFetch').mockRejectedValue(
      new client.ApiError('AI_PROVIDER_UNAVAILABLE', 'AI assistant is currently unavailable', 503),
    );

    await expect(
      requestAiAssistance({
        draftText: 'Valid length test draft for ai assistance',
        action: 'improve_clarity',
      }),
    ).rejects.toThrow('AI assistant is currently unavailable');
  });
});
