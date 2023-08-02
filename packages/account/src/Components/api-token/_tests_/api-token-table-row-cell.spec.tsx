import React from 'react';
import { screen, render } from '@testing-library/react';
import ApiTokenTableRowCell from '../api-token-table-row-cell';

describe('ApiTokenTableRowCell', () => {
    const mock_props = {
        className: 'api_token_table_row_cell',
        should_bypass_text: false,
    };
    const children = 'Api Table Row Cell';
    it('should render ApiTokenTableRowCell', () => {
        render(<ApiTokenTableRowCell {...mock_props}>{children}</ApiTokenTableRowCell>);
        expect(screen.getByText('Api Table Row Cell')).toBeInTheDocument();
        expect(screen.getByText('Api Table Row Cell')).toHaveClass('dc-text');
    });

    it('should render ApiTokenTableRowCell with table data if should_bypass_text is true', () => {
        render(
            <ApiTokenTableRowCell {...mock_props} should_bypass_text>
                {children}
            </ApiTokenTableRowCell>
        );
        expect(screen.getByText('Api Table Row Cell')).toBeInTheDocument();
        expect(screen.getByText('Api Table Row Cell')).not.toHaveClass('dc-text');
        expect(screen.getByText('Api Table Row Cell')).toHaveClass('da-api-token__table-cell api_token_table_row_cell');
    });
});
