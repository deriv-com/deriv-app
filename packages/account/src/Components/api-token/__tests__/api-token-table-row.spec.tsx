import React from 'react';
import { screen, render } from '@testing-library/react';
import ApiTokenTableRow from '../api-token-table-row';

describe('ApiTokenTableRow', () => {
    const mock_props: React.ComponentProps<typeof ApiTokenTableRow> = {
        token: {
            display_name: 'Api Token',
            last_used: '31/12/2022',
            formatted_scopes: ['Api scope 1', 'Api scope 2'],
            token: '1234567',
        },
    };
    it('should render ApiTokenTableRow', () => {
        render(<ApiTokenTableRow {...mock_props} />);
        const texts = ['Api Token', 'Api scope 1', 'Api scope 2', '31/12/2022'];

        const test_ids = [
            'dt_hidden_tokens',
            'dt_copy_token_icon',
            'dt_toggle_visibility_icon',
            'dt_token_delete_icon',
        ];

        texts.forEach(text => {
            expect(screen.getByText(text)).toBeInTheDocument();
        });

        test_ids.forEach(test_id => {
            expect(screen.getByTestId(test_id)).toBeInTheDocument();
        });
    });
});
