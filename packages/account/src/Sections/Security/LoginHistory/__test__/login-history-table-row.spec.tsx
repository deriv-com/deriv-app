import React from 'react';
import { screen, render } from '@testing-library/react';
import LoginHistoryTableRow from '../login-history-table-row';

describe('LoginHistoryListRow', () => {
    const mock_props: React.ComponentProps<typeof LoginHistoryTableRow> = {
        id: 0,
        date: '2023-08-29 07:05:35 GMT',
        action: 'Login',
        browser: 'Chrome  v116.0.0.0',
        ip: 'MOCK.IP.ADDRESS',
        status: 'Successful',
    };

    it('should render LoginHistoryTableRow Table Content', () => {
        const texts = [/2023-08-29 07:05:35 GMT/i, /chrome v116.0.0.0/i, /login/i, /MOCK.IP.ADDRESS/i, /successful/i];
        render(<LoginHistoryTableRow {...mock_props} />);
        texts.forEach(text => {
            expect(screen.getByText(text)).toBeInTheDocument();
        });
    });

    it('should display unknown in browser if browser return value is unknown', () => {
        mock_props.browser = 'Unknown';
        render(<LoginHistoryTableRow {...mock_props} />);
        expect(screen.getByText(/unknown/i)).toBeInTheDocument();
    });
});
