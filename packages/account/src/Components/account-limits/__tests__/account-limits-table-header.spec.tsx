import React from 'react';
import { screen, render } from '@testing-library/react';
import AccountLimitsTableHeader from '../account-limits-table-header';

describe('<AccountLimitsTableHeader/>', () => {
    it('should render AccountLimitsTableHeader component', () => {
        render(<AccountLimitsTableHeader />, {
            container: document.body.appendChild(document.createElement('tr')),
        });
        expect(screen.getByTestId('account_limit_table_header')).toBeInTheDocument();
    });

    it('should render the children if children is passed', () => {
        const props = {
            children: <span data-testid='table_header_child'>Test</span>,
        };
        render(<AccountLimitsTableHeader {...props} />, {
            container: document.body.appendChild(document.createElement('tr')),
        });
        expect(screen.getByTestId('table_header_child')).toBeInTheDocument();
    });

    it('should not render Text component if children is not passed ', () => {
        render(<AccountLimitsTableHeader />, {
            container: document.body.appendChild(document.createElement('tr')),
        });
        expect(screen.queryByTestId('account_limit_table_header_text')).not.toBeInTheDocument();
    });

    it('should render renderExtraInfo if it is passed', () => {
        const props = {
            renderExtraInfo: () => <span data-testid='table_header_render_extra_info'>test render extra function</span>,
        };
        render(<AccountLimitsTableHeader {...props} />, {
            container: document.body.appendChild(document.createElement('tr')),
        });
        expect(screen.getByTestId('table_header_render_extra_info')).toBeInTheDocument();
    });
});
