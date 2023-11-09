import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ApiTokenTableRowTokenCell from '../api-token-table-row-token-cell';

describe('ApiTokenTableRowTokenCell', () => {
    const mock_props: React.ComponentProps<typeof ApiTokenTableRowTokenCell> = {
        token: '1234567',
        scopes: ['api scope 1', 'api scope 2'],
    };
    it('should render ApiTokenTableRowTokenCell', () => {
        render(<ApiTokenTableRowTokenCell {...mock_props} />);
        expect(screen.getByTestId('dt_hidden_tokens')).toBeInTheDocument();
        expect(screen.getByTestId('dt_copy_token_icon')).toBeInTheDocument();
        expect(screen.getByTestId('dt_toggle_visibility_icon')).toBeInTheDocument();
        expect(screen.getByTestId('dt_toggle_visibility_icon')).toHaveClass('dc-icon da-api-token__visibility-icon');
    });

    it('should show token after clicking on dt_toggle_visibility_icon', () => {
        render(<ApiTokenTableRowTokenCell {...mock_props} />);
        const toggle_token_button = screen.getByTestId('dt_toggle_visibility_icon');
        userEvent.click(toggle_token_button);
        expect(screen.getByText('1234567')).toBeInTheDocument();
        expect(screen.getByTestId('dt_toggle_visibility_icon')).toBeInTheDocument();
    });
});
