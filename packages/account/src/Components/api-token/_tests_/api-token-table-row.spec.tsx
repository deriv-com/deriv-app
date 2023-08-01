import React from 'react';
import { screen, render } from '@testing-library/react';
import ApiTokenTableRow from '../api-token-table-row';

describe('ApiTokenTableRow', () => {
    const mock_props = {
        token: {
            display_name: 'Api Token',
            last_used: '31/12/2022',
            scopes: ['Api scope 1', 'Api scope 2'],
            token: '1234567',
        },
    };
    it('should render ApiTokenTableRow', () => {
        render(<ApiTokenTableRow {...mock_props} />);
        expect(screen.getByText('Api Token')).toBeInTheDocument();
        expect(screen.getByTestId('dt_hidden_tokens')).toBeInTheDocument();
        expect(screen.getByTestId('dt_copy_token_icon')).toBeInTheDocument();
        expect(screen.getByTestId('dt_toggle_visibility_icon')).toBeInTheDocument();
        expect(screen.getByTestId('dt_token_delete_icon')).toBeInTheDocument();
        expect(screen.getByText('Api scope 1')).toBeInTheDocument();
        expect(screen.getByText('Api scope 2')).toBeInTheDocument();
        expect(screen.getByText('31/12/2022')).toBeInTheDocument();
    });
});
