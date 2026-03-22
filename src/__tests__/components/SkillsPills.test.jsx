import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SkillsPills from '../../components/ui/SkillsPills';

describe('SkillsPills', () => {
  it('renders skills as pills', () => {
    render(<SkillsPills skills={['React', 'Node.js', 'Python']} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
  });

  it('renders empty when no skills', () => {
    const { container } = render(<SkillsPills skills={[]} />);
    // No skill pill elements
    const pills = container.querySelectorAll('span');
    expect(pills.length).toBe(0);
  });

  it('renders with default empty array', () => {
    const { container } = render(<SkillsPills />);
    expect(container).toBeInTheDocument();
  });

  it('does not show remove buttons when not editable', () => {
    render(<SkillsPills skills={['React']} editable={false} />);
    // XMarkIcon button should not be present
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('shows remove buttons when editable', () => {
    render(<SkillsPills skills={['React']} editable={true} onChange={vi.fn()} />);
    const buttons = screen.getAllByRole('button');
    // At least the remove button + the add button
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });

  it('calls onChange when a skill is removed', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<SkillsPills skills={['React', 'Vue']} editable={true} onChange={onChange} />);

    // Find the remove button for React (first X button)
    const removeButtons = screen.getAllByRole('button');
    await user.click(removeButtons[0]);

    expect(onChange).toHaveBeenCalledWith(['Vue']);
  });
});
