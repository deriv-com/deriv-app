import React from 'react';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VerificationStatusActionButton from '../verification-status-action-button';

describe('<VerificationStatusActionButton />', () => {
    const mocked_button_text = 'Test button name';
    const history = createMemoryHistory();
    const mockOnClick = jest.fn();

    it('should render VerificationStatusActionButton as link if path is passed ', () => {
        render(
            <Router history={history}>
                <VerificationStatusActionButton button_text={<div>{mocked_button_text}</div>} to='/testpath' />
            </Router>
        );

        expect(screen.queryByRole('button', { name: mocked_button_text })).not.toBeInTheDocument();
        const link = screen.getByRole('link', { name: mocked_button_text });
        expect(history.location.pathname).toBe('/');
        expect(link).toHaveAttribute('href', '/testpath');
        userEvent.click(link);
        expect(history.location.pathname).toBe('/testpath');
    });

    it('should render VerificationStatusActionButton as button if path is not passed ', () => {
        render(<VerificationStatusActionButton button_text={<div>{mocked_button_text}</div>} onClick={mockOnClick} />);

        const button = screen.getByRole('button', { name: mocked_button_text });
        expect(screen.queryByRole('link', { name: mocked_button_text })).not.toBeInTheDocument();
        userEvent.click(button);
        expect(mockOnClick).toHaveBeenCalled();
    });
});
