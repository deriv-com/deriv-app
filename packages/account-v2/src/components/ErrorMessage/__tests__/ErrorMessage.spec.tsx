import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorMessage } from '../ErrorMessage';

const original = window.location;

beforeAll(() => {
    Object.defineProperty(window, 'location', {
        configurable: true,
        value: { reload: jest.fn() },
    });
});

afterAll(() => {
    Object.defineProperty(window, 'location', { configurable: true, value: original });
});

describe('ErrorMessage', () => {
    it('renders error message', () => {
        const errorMessage = 'Test error message';
        render(<ErrorMessage message={errorMessage} />);
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('renders default error message when message prop is not provided', () => {
        const defaultMessage = 'Sorry, an error occurred while processing your request.';
        render(<ErrorMessage />);
        expect(screen.getByText(defaultMessage)).toBeInTheDocument();
    });

    it('renders refresh button', () => {
        render(<ErrorMessage />);
        const refreshButton = screen.getByText('Refresh');
        expect(refreshButton).toBeInTheDocument();
    });

    it('calls location.reload() when refresh button is clicked', () => {
        render(<ErrorMessage />);
        const refreshButton = screen.getByText('Refresh');
        userEvent.click(refreshButton);
        expect(window.location.reload).toHaveBeenCalled();
    });
});
