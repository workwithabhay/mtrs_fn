import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PixelCard from '@/components/ui/PixelCard';

describe('PixelCard Component', () => {
  it('renders children with canvas and rim', () => {
    render(
      <PixelCard
        colors={['#18181b', '#52525b', '#a1a1aa']}
        glowColor="#71717a"
        shape="square"
        origin="center"
        gap={5}
        pixelSize={2}
        speed={35}
        revealDuration={600}
        spotlight={0.5}
        glow={0.5}
        opacity={0.35}
        fade={0.7}
        trigger="hover"
        radius={24}
        clickPulse
        intro
        theme="light"
      >
        <div data-testid="pixel-card-child">
          <h3>Test Plan</h3>
          <p>Test description</p>
        </div>
      </PixelCard>,
    );

    expect(screen.getByTestId('pixel-card-child')).toBeInTheDocument();
    expect(screen.getByText('Test Plan')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('safely handles pointer enter, move, and down events', () => {
    const { container } = render(
      <PixelCard
        colors={['#18181b', '#52525b', '#a1a1aa']}
        trigger="hover"
        theme="light"
      >
        <span>Content</span>
      </PixelCard>,
    );

    const card = container.firstChild as HTMLElement;
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute('data-theme', 'light');

    fireEvent.pointerEnter(card, { clientX: 20, clientY: 20, pointerType: 'mouse' });
    fireEvent.pointerMove(card, { clientX: 30, clientY: 30 });
    fireEvent.pointerDown(card, { clientX: 30, clientY: 30 });
    fireEvent.pointerLeave(card);
  });
});
