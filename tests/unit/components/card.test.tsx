import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

describe('Card Component Composition', () => {
  it('should render all card subcomponents in proper hierarchy', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Campaign Analytics</CardTitle>
          <CardDescription>Monthly scan metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Total Scans: 1,420</p>
        </CardContent>
        <CardFooter>
          <span>Last updated 2 mins ago</span>
        </CardFooter>
      </Card>,
    );

    expect(screen.getByRole('heading', { level: 3, name: 'Campaign Analytics' })).toBeInTheDocument();
    expect(screen.getByText('Monthly scan metrics')).toBeInTheDocument();
    expect(screen.getByText('Total Scans: 1,420')).toBeInTheDocument();
    expect(screen.getByText('Last updated 2 mins ago')).toBeInTheDocument();
  });

  it('should apply interactive hover classes when isInteractive is true', () => {
    const { container } = render(<Card isInteractive>Interactive Card</Card>);
    expect(container.firstChild).toHaveClass('hover:shadow-elevated');
  });
});
