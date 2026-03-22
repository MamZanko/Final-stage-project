import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfirmModal from '../../components/ui/ConfirmModal';

describe('ConfirmModal', () => {
  it('renders title and message when open', () => {
    render(
      <ConfirmModal
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Delete Item?"
        message="This will be permanent."
      />
    );
    expect(screen.getByText('Delete Item?')).toBeInTheDocument();
    expect(screen.getByText('This will be permanent.')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <ConfirmModal
        isOpen={false}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Delete?"
        message="Gone forever"
      />
    );
    expect(screen.queryByText('Delete?')).not.toBeInTheDocument();
  });

  it('renders default title and message', () => {
    render(
      <ConfirmModal isOpen={true} onClose={vi.fn()} onConfirm={vi.fn()} />
    );
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
  });

  it('renders custom button texts', () => {
    render(
      <ConfirmModal
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        confirmText="Yes, Delete"
        cancelText="No, Keep"
      />
    );
    expect(screen.getByText('Yes, Delete')).toBeInTheDocument();
    expect(screen.getByText('No, Keep')).toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();

    render(
      <ConfirmModal
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={onConfirm}
        confirmText="Confirm"
      />
    );

    await user.click(screen.getByText('Confirm'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when cancel button is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(
      <ConfirmModal
        isOpen={true}
        onClose={onClose}
        onConfirm={vi.fn()}
        cancelText="Cancel"
      />
    );

    await user.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
