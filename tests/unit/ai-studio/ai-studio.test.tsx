import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AiStudioContainer } from '@/components/ai-studio/ai-studio-container';
import * as aiStudioApi from '@/lib/api/ai-studio';
import * as toastModule from '@/components/ui/toast';

describe('AI Feedback Studio Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders page header, ethical boundaries banner, empty state, and action choices', () => {
    render(<AiStudioContainer />);

    expect(screen.getByRole('heading', { name: /ai feedback studio/i })).toBeInTheDocument();
    expect(screen.getByText(/truthful & ethical ai assistance/i)).toBeInTheDocument();
    expect(screen.getByText(/human-in-the-loop/i)).toBeInTheDocument();
    expect(screen.getByText(/ready to polish feedback/i)).toBeInTheDocument();

    // Verify all 4 actions are present
    expect(screen.getByRole('radio', { name: /fix grammar/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /improve clarity/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /make concise/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /professional tone/i })).toBeInTheDocument();
  });

  it('enforces input minimum length (10 chars) and disables Generate button until valid', () => {
    render(<AiStudioContainer />);

    const generateBtn = screen.getByRole('button', { name: /generate revision/i });
    expect(generateBtn).toBeDisabled();

    const input = screen.getByPlaceholderText(/paste or write customer feedback/i);

    // Type 5 characters
    fireEvent.change(input, { target: { value: 'Short' } });
    expect(screen.getByText(/please enter at least 10 characters \(5\/10\)/i)).toBeInTheDocument();
    expect(generateBtn).toBeDisabled();

    // Type valid length (12 characters)
    fireEvent.change(input, { target: { value: 'Valid text sample' } });
    expect(screen.queryByText(/please enter at least 10 characters/i)).not.toBeInTheDocument();
    expect(generateBtn).not.toBeDisabled();
  });

  it('loads sample drafts when clicking quick sample buttons', () => {
    render(<AiStudioContainer />);

    const grammarSampleBtn = screen.getByRole('button', { name: /grammar sample/i });
    fireEvent.click(grammarSampleBtn);

    const input = screen.getByPlaceholderText(/paste or write customer feedback/i) as HTMLTextAreaElement;
    expect(input.value).toContain('teh dessert was recieved late');

    const generateBtn = screen.getByRole('button', { name: /generate revision/i });
    expect(generateBtn).not.toBeDisabled();
  });

  it('switches editing actions via keyboard and click', () => {
    render(<AiStudioContainer />);

    const clarityRadio = screen.getByRole('radio', { name: /improve clarity/i });
    const grammarRadio = screen.getByRole('radio', { name: /fix grammar/i });

    expect(grammarRadio).toHaveAttribute('aria-checked', 'true');
    expect(clarityRadio).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(clarityRadio);
    expect(clarityRadio).toHaveAttribute('aria-checked', 'true');
    expect(grammarRadio).toHaveAttribute('aria-checked', 'false');
  });

  it('generates revision, displays side-by-side comparison, and leaves original text unchanged', async () => {
    const original = 'the dessert was recieved late and i was unhappy';
    const suggested = 'The dessert was received late and I was unhappy.';

    vi.spyOn(aiStudioApi, 'requestAiAssistance').mockResolvedValueOnce({
      originalDraft: original,
      suggestedText: suggested,
      mode: 'fix_grammar',
    });

    render(<AiStudioContainer />);

    const input = screen.getByPlaceholderText(/paste or write customer feedback/i);
    fireEvent.change(input, { target: { value: original } });

    const generateBtn = screen.getByRole('button', { name: /generate revision/i });
    fireEvent.click(generateBtn);

    // Assert revision rendered
    await waitFor(() => {
      expect(screen.getByDisplayValue(suggested)).toBeInTheDocument();
    });

    // Original input should still have exact original text
    expect(input).toHaveValue(original);

    // Word counts should be shown
    expect(screen.getByText(/word count:/i)).toBeInTheDocument();
  });

  it('allows user to manually edit proposed revision text', async () => {
    vi.spyOn(aiStudioApi, 'requestAiAssistance').mockResolvedValueOnce({
      originalDraft: 'in my opinion the meal was good',
      suggestedText: 'The meal was good.',
      mode: 'make_concise',
    });

    render(<AiStudioContainer />);

    const input = screen.getByPlaceholderText(/paste or write customer feedback/i);
    fireEvent.change(input, { target: { value: 'in my opinion the meal was good' } });

    fireEvent.click(screen.getByRole('button', { name: /generate revision/i }));

    await waitFor(() => {
      expect(screen.getByDisplayValue('The meal was good.')).toBeInTheDocument();
    });

    const revisedInput = screen.getByDisplayValue('The meal was good.');
    fireEvent.change(revisedInput, { target: { value: 'The meal was extraordinarily good.' } });

    expect(screen.getByDisplayValue('The meal was extraordinarily good.')).toBeInTheDocument();
  });

  it('marks revision as outdated when source text is changed after generation', async () => {
    vi.spyOn(aiStudioApi, 'requestAiAssistance').mockResolvedValueOnce({
      originalDraft: 'original initial draft text sample',
      suggestedText: 'Original initial draft text sample.',
      mode: 'fix_grammar',
    });

    render(<AiStudioContainer />);

    const input = screen.getByPlaceholderText(/paste or write customer feedback/i);
    fireEvent.change(input, { target: { value: 'original initial draft text sample' } });

    fireEvent.click(screen.getByRole('button', { name: /generate revision/i }));

    await waitFor(() => {
      expect(screen.getByDisplayValue('Original initial draft text sample.')).toBeInTheDocument();
    });

    // Outdated warning should not exist yet
    expect(screen.queryByText(/original draft changed since this revision/i)).not.toBeInTheDocument();

    // Modify source text
    fireEvent.change(input, { target: { value: 'modified draft text sample' } });

    // Outdated warning should appear
    expect(screen.getByText(/original draft changed since this revision was generated/i)).toBeInTheDocument();
  });

  it('supports explicit Accept Revision action', async () => {
    vi.spyOn(aiStudioApi, 'requestAiAssistance').mockResolvedValueOnce({
      originalDraft: 'the steak was cold and fries were soggy',
      suggestedText: 'The steak was cold and the fries were soggy.',
      mode: 'fix_grammar',
    });

    render(<AiStudioContainer />);

    const input = screen.getByPlaceholderText(/paste or write customer feedback/i);
    fireEvent.change(input, { target: { value: 'the steak was cold and fries were soggy' } });

    fireEvent.click(screen.getByRole('button', { name: /generate revision/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /accept proposed revision/i })).toBeInTheDocument();
    });

    const acceptBtn = screen.getByRole('button', { name: /accept proposed revision/i });
    fireEvent.click(acceptBtn);

    expect(screen.getAllByText('Accepted').length).toBeGreaterThanOrEqual(1);
    expect(acceptBtn).toBeDisabled();
  });

  it('supports Copy to Clipboard with toast confirmation', async () => {
    const toastSuccessSpy = vi.spyOn(toastModule.toast, 'success');
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });

    vi.spyOn(aiStudioApi, 'requestAiAssistance').mockResolvedValueOnce({
      originalDraft: 'service was prompt and polite',
      suggestedText: 'Service was prompt and polite.',
      mode: 'fix_grammar',
    });

    render(<AiStudioContainer />);

    const input = screen.getByPlaceholderText(/paste or write customer feedback/i);
    fireEvent.change(input, { target: { value: 'service was prompt and polite' } });

    fireEvent.click(screen.getByRole('button', { name: /generate revision/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /copy proposed revision to clipboard/i })).toBeInTheDocument();
    });

    const copyBtn = screen.getByRole('button', { name: /copy proposed revision to clipboard/i });
    fireEvent.click(copyBtn);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Service was prompt and polite.');
      expect(toastSuccessSpy).toHaveBeenCalledWith('Revised text copied to clipboard!');
    });
  });

  it('supports Discard action to clear revision without deleting source input', async () => {
    vi.spyOn(aiStudioApi, 'requestAiAssistance').mockResolvedValueOnce({
      originalDraft: 'sample text draft for discard test',
      suggestedText: 'Sample text draft for discard test.',
      mode: 'fix_grammar',
    });

    render(<AiStudioContainer />);

    const input = screen.getByPlaceholderText(/paste or write customer feedback/i);
    fireEvent.change(input, { target: { value: 'sample text draft for discard test' } });

    fireEvent.click(screen.getByRole('button', { name: /generate revision/i }));

    await waitFor(() => {
      expect(screen.getByDisplayValue('Sample text draft for discard test.')).toBeInTheDocument();
    });

    const discardBtn = screen.getByRole('button', { name: /discard revision/i });
    fireEvent.click(discardBtn);

    // Revision should be gone, empty state restored
    expect(screen.queryByDisplayValue('Sample text draft for discard test.')).not.toBeInTheDocument();
    expect(screen.getByText(/ready to polish feedback/i)).toBeInTheDocument();

    // Original text should remain intact
    expect(input).toHaveValue('sample text draft for discard test');
  });

  it('displays user-friendly error alert when generation fails and preserves input', async () => {
    vi.spyOn(aiStudioApi, 'requestAiAssistance').mockRejectedValueOnce(
      new Error('AI assistant service is currently unavailable. Please try again shortly.'),
    );

    render(<AiStudioContainer />);

    const input = screen.getByPlaceholderText(/paste or write customer feedback/i);
    fireEvent.change(input, { target: { value: 'sample text draft for error test' } });

    fireEvent.click(screen.getByRole('button', { name: /generate revision/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/ai assistant service is currently unavailable/i)).toBeInTheDocument();
    });

    // Input preserved
    expect(input).toHaveValue('sample text draft for error test');
  });
});
