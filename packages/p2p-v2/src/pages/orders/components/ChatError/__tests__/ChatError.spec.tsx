import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatError from '../ChatError';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: true }),
}));

describe('ChatError', () => {
    it('should render the component as expected', () => {
        render(<ChatError onClickRetry={jest.fn()} />);
        expect(screen.getByText('Oops, something went wrong')).toBeInTheDocument();
    });

    it('should handle the onclick', () => {
        const mockFn = jest.fn();
        render(<ChatError onClickRetry={mockFn} />);
        const button = screen.getByRole('button', { name: 'Retry' });
        userEvent.click(button);
        expect(mockFn).toHaveBeenCalled();
    });
});
