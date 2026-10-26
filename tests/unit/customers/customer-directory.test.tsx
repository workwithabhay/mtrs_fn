import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { CustomerDirectory } from '@/components/customers/customer-directory';
import * as customersApi from '@/lib/api/customers';

vi.mock('@/lib/api/customers', () => ({
  listCustomers: vi.fn(),
}));

const mockDirectoryData = {
  customers: [
    {
      id: 'cust-1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+919876543210',
      lastVisitedAt: '2026-10-22T14:30:00.000Z',
      createdAt: '2026-08-15T10:00:00.000Z',
      feedbackCount: 3,
      avgRating: 4.8,
      latestRating: 5,
      isRepeat: true,
    },
    {
      id: 'cust-2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: null,
      lastVisitedAt: '2026-10-23T11:00:00.000Z',
      createdAt: '2026-10-23T11:00:00.000Z',
      feedbackCount: 1,
      avgRating: 4.0,
      latestRating: 4,
      isRepeat: false,
    },
  ],
  stats: {
    totalCustomers: 2,
    repeatCustomers: 1,
    averageRating: 4.4,
  },
  total: 2,
  page: 1,
  limit: 10,
  totalPages: 1,
};

describe('CustomerDirectory Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders customer directory header, stats cards, and customer records', async () => {
    vi.mocked(customersApi.listCustomers).mockResolvedValue(mockDirectoryData);

    render(<CustomerDirectory />);

    expect(screen.getByRole('heading', { name: /customers directory/i })).toBeInTheDocument();

    await waitFor(() => {
      // Stats
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('4.4 / 5')).toBeInTheDocument();

      // Customer rows
      expect(screen.getAllByText('John Doe').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Jane Smith').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('john@example.com').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('+919876543210').length).toBeGreaterThanOrEqual(1);

      // Repeat badge
      expect(screen.getAllByText(/repeat/i).length).toBeGreaterThanOrEqual(1);
    });
  });

  it('renders empty state when no customer records exist', async () => {
    vi.mocked(customersApi.listCustomers).mockResolvedValue({
      customers: [],
      stats: { totalCustomers: 0, repeatCustomers: 0, averageRating: null },
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1,
    });

    render(<CustomerDirectory />);

    await waitFor(() => {
      expect(screen.getByText(/no customer profiles yet/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /view qr campaigns/i })).toBeInTheDocument();
    });
  });

  it('triggers search when typing in search input', async () => {
    vi.mocked(customersApi.listCustomers).mockResolvedValue(mockDirectoryData);

    render(<CustomerDirectory />);

    const searchInput = screen.getByRole('textbox', { name: /search customers/i });
    fireEvent.change(searchInput, { target: { value: 'john' } });

    await waitFor(
      () => {
        expect(customersApi.listCustomers).toHaveBeenCalledWith(
          expect.objectContaining({ search: 'john' }),
        );
      },
      { timeout: 1000 },
    );
  });
});
