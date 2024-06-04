import React from 'react';
import { screen, render } from '@testing-library/react';
import ApiTokenTableRowCell from '../api-token-table-row-cell';

describe('ApiTokenTableRowCell', () => {
    const mock_props: React.ComponentProps<typeof ApiTokenTableRowCell> = {
        className: 'api_token_table_row_cell',
        should_bypass_text: false,
    };
    const children = 'Api Table Row Cell';
    it('should render ApiTokenTableRowCell', () => {
        render(<ApiTokenTableRowCell {...mock_props}>{children}</ApiTokenTableRowCell>);
        const text_message = screen.getByText(children);
        expect(text_message).toBeInTheDocument();
        expect(text_message).toHaveClass('dc-text');
    });

    it('should render ApiTokenTableRowCell with table data if should_bypass_text is true', () => {
        render(
            <ApiTokenTableRowCell {...mock_props} should_bypass_text>
                {children}
            </ApiTokenTableRowCell>
        );
        const text_message = screen.getByText(children);
        expect(text_message).toBeInTheDocument();
        expect(text_message).not.toHaveClass('dc-text');
        expect(text_message).toHaveClass('da-api-token__table-cell api_token_table_row_cell');
    });
});
