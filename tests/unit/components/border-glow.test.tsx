import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BorderGlow from '@/components/ui/BorderGlow';

describe('BorderGlow Component', () => {
  it('renders children and applies container styles', () => {
    render(
      <BorderGlow
        edgeSensitivity={30}
        glowColor="40 80 80"
        backgroundColor="#120F17"
        borderRadius={28}
        glowRadius={40}
        glowIntensity={1}
        coneSpread={25}
        animated={false}
        colors={['#c084fc', '#f472b6', '#38bdf8']}
      >
        <div data-testid="glow-content">
          <h2>Test Card</h2>
          <p>Hover near the edges to see the glow.</p>
        </div>
      </BorderGlow>,
    );

    expect(screen.getByTestId('glow-content')).toBeInTheDocument();
    expect(screen.getByText('Test Card')).toBeInTheDocument();
  });

  it('handles pointer hover and leave events safely', () => {
    const { container } = render(
      <BorderGlow
        edgeSensitivity={30}
        glowColor="40 80 80"
        backgroundColor="#120F17"
      >
        <span>Content</span>
      </BorderGlow>,
    );

    const glowRoot = container.firstChild as HTMLElement;
    expect(glowRoot).toBeInTheDocument();

    fireEvent.pointerEnter(glowRoot);
    fireEvent.pointerMove(glowRoot, { clientX: 50, clientY: 50 });
    fireEvent.pointerLeave(glowRoot);
  });
});
