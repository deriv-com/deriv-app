import React from 'react';
import { screen, render } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { APIProvider } from '@deriv/api';
import LoginHistoryListRow from '../login-history-list-row';

describe('LoginHistoryListRow', () => {
    let mock_store: ReturnType<typeof mockStore>;

    const mock_props: React.ComponentProps<typeof LoginHistoryListRow> = {
        id: 0,
        date: '2023-08-29 07:05:35 GMT',
        action: 'Login',
        browser: 'Chrome  v116.0.0.0',
        ip: 'MOCK.IP.ADDRESS',
        status: 'Successful',
    };

    const renderComponent = () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock_store}>{children}</StoreProvider>
            </APIProvider>
        );
        render(<LoginHistoryListRow {...mock_props} />, { wrapper });
    };

    beforeEach(() => {
        mock_store = mockStore({
            ui: {
                is_desktop: true,
            },
        });
    });
    it('should render LoginHistoryListRow Table Title', () => {
        const titles = [/date and time/i, /browser/i, /ip address/i, /action/i, /status/i];
        renderComponent();
        titles.forEach(title => {
            expect(screen.getByText(title)).toBeInTheDocument();
        });
    });

    it('should render LoginHistoryListRow Table Content', () => {
        const texts = [/2023-08-29 07:05:35 GMT/i, /chrome v116.0.0.0/i, /login/i, /MOCK.IP.ADDRESS/i, /successful/i];
        renderComponent();
        texts.forEach(text => {
            expect(screen.getByText(text)).toBeInTheDocument();
        });
    });

    it('should display unknown in browser if browser return value is unknown', () => {
        mock_props.browser = 'Unknown';
        renderComponent();
        expect(screen.getByText(/unknown/i)).toBeInTheDocument();
    });

    it('should not render Status if is not desktop', () => {
        mock_store.ui.is_desktop = false;
        renderComponent();
        expect(screen.queryByText('status')).not.toBeInTheDocument();
        expect(screen.queryByText('successful')).not.toBeInTheDocument();
    });
});
