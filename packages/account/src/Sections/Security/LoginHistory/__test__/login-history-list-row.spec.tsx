import React from 'react';
import { screen, render } from '@testing-library/react';
import { isDesktop } from '@deriv/shared';
import LoginHistoryListRow from '../login-history-list-row';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(() => true),
}));

describe('LoginHistoryListRow', () => {
    const mock_props = {
        id: 0,
        date: '2023-08-29 07:05:35 GMT',
        action: 'Login',
        browser: 'Chrome  v116.0.0.0',
        ip: '175.143.37.57',
        status: 'Successful',
    };
    it('should render LoginHistoryListRow Table Title', () => {
        const titles = [/date and time/i, /browser/i, /ip/i, /action/i, /status/i];
        render(<LoginHistoryListRow {...mock_props} />);
        titles.forEach(title => {
            expect(screen.getByText(title)).toBeInTheDocument();
        });
    });

    it('should render LoginHistoryListRow Table Content', () => {
        const texts = [/2023-08-29 07:05:35 GMT/i, /chrome v116.0.0.0/i, /login/i, /175.143.37.57/i, /successful/i];
        render(<LoginHistoryListRow {...mock_props} />);
        texts.forEach(text => {
            expect(screen.getByText(text)).toBeInTheDocument();
        });
    });

    it('should display unknown in browser if browser return value is unknown', () => {
        mock_props.browser = 'Unknown';
        render(<LoginHistoryListRow {...mock_props} />);
        expect(screen.getByText(/unknown/i)).toBeInTheDocument();
    });

    it('should not render Status if is not desktop', () => {
        (isDesktop as jest.Mock).mockReturnValue(false);
        render(<LoginHistoryListRow {...mock_props} />);
        expect(screen.queryByText('status')).not.toBeInTheDocument();
        expect(screen.queryByText('successful')).not.toBeInTheDocument();
    });
});
