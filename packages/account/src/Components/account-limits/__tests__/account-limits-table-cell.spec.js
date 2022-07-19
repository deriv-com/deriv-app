import React from 'react';
import { screen, render } from '@testing-library/react';
import AccountLimitsTableCell from '../account-limits-table-cell';

describe('<AccountLimitsTableCell/>', () => {
    it('should render AccountLimitsTableCell component', () => {
        render(<AccountLimitsTableCell />, {
            container: document.body.appendChild(document.createElement('tr')),
        });
        expect(screen.getByTestId('account_limit_table_cell')).toBeInTheDocument();
    });

    it('should render the children if children is passed', () => {
        const props = {
            children: <span data-testid='table_cell_child'>Test</span>,
        };
        render(<AccountLimitsTableCell {...props} />, {
            container: document.body.appendChild(document.createElement('tr')),
        });
        expect(screen.getByTestId('table_cell_child')).toBeInTheDocument();
    });

    it('should not render Text component if children is not passed ', () => {
        render(<AccountLimitsTableCell />, {
            container: document.body.appendChild(document.createElement('tr')),
        });
        expect(screen.queryByTestId('account_limit_table_cell_text')).not.toBeInTheDocument();
    });

    it('should render renderExtraInfo if it is passed', () => {
        const props = {
            renderExtraInfo: () => <span data-testid='table_cell_render_extra_info'>test render extra function</span>,
        };
        render(<AccountLimitsTableCell {...props} />, {
            container: document.body.appendChild(document.createElement('tr')),
        });
        expect(screen.getByTestId('table_cell_render_extra_info')).toBeInTheDocument();
    });
});
