import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PoincFailed } from '../failed';

describe('<PoincFailed/>', () => {
    const mockOnReSubmit = jest.fn();
    it('should render PoincFailed component and trigger click', () => {
        render(<PoincFailed onReSubmit={mockOnReSubmit} />);
        expect(screen.getByText('Income verification failed')).toBeInTheDocument();
        expect(screen.getByText(/please check the email we've sent you for further information/i)).toBeInTheDocument();
        const btn = screen.getByRole('button', { name: /try again/i });
        userEvent.click(btn);
        expect(mockOnReSubmit).toHaveBeenCalled();
    });
});
