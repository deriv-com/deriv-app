import React from 'react';
import { screen, render } from '@testing-library/react';
import { useLoginHistory, APIProvider } from '@deriv/api';
import { isMobile } from '@deriv/shared';
import { StoreProvider, mockStore } from '@deriv/stores';
import LoginHistory from '../login-history';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');

    return {
        ...original_module,
        Loading: jest.fn(() => 'mockedLoading'),
    };
});

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useLoginHistory: jest.fn(),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
}));

const mockUseLoginHistory = useLoginHistory as jest.MockedFunction<typeof useLoginHistory>;

describe('<LoginHistory />', () => {
    let mock_store = mockStore({});
    let response = {
        data: {
            formatted_data: [
                {
                    date: '',
                    browser: '',
                    action: '',
                    status: '',
                    ip: '',
                    id: 0,
                },
            ],
        },
        isLoading: false,
        isError: false,
        error: '',
    };

    const renderComponent = () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock_store}>{children}</StoreProvider>
            </APIProvider>
        );
        mockUseLoginHistory.mockReturnValue(response);
        render(<LoginHistory />, { wrapper });
    };

    beforeEach(() => {
        (isMobile as jest.Mock).mockReturnValue(false);
        mock_store = mockStore({
            client: {
                is_switching: false,
                is_authorize: true,
            },
            ui: {
                is_mobile: false,
            },
        });

        response = {
            data: {
                formatted_data: [
                    {
                        date: '2023-08-28 03:11:45 GMT',
                        browser: '"Chrome  v116.0.0.0"',
                        action: 'login',
                        status: 'successful',
                        ip: '175.143.37.57',
                        id: 0,
                    },
                ],
            },
            isLoading: false,
            isError: false,
            error: 'this is an error message',
        };
    });

    it('should render Login History List when isMobile is true', () => {
        mock_store.ui.is_mobile = true;
        renderComponent();
        expect(screen.getByText(/date and time/i)).toHaveClass('dc-text login-history__list__row__cell--title');
    });

    it('should render Login History Table', () => {
        renderComponent();
        expect(screen.getByText(/date and time/i)).not.toHaveClass('dc-text login-history__list__row__cell--title');
    });

    it('should render Table Header.', () => {
        renderComponent();
        const table_headers = [/date and time/i, /action/i, /browser/i, /ip address/i, /status/i];
        table_headers.forEach(header => {
            expect(screen.getByText(header)).toBeInTheDocument();
        });
    });

    it('should render Table Items.', () => {
        renderComponent();
        const table_items = [
            /2023-08-28 03:11:45 GMT/i,
            /login/i,
            /chrome v116.0.0.0/i,
            /175.143.37.57/i,
            /successful/i,
        ];
        table_items.forEach(item => {
            expect(screen.getByText(item)).toBeInTheDocument();
        });
    });

    it('should render Loading if client: is_switching is true', () => {
        mock_store.client.is_switching = true;
        renderComponent();
        expect(screen.getByText('mockedLoading')).toBeInTheDocument();
    });

    it('should render Loading isLoading is true', () => {
        response.isLoading = true;
        renderComponent();
        expect(screen.getByText('mockedLoading')).toBeInTheDocument();
    });

    it('should render Error with error message', () => {
        response.isError = true;
        renderComponent();
        expect(screen.getByText(/this is an error message/i)).toBeInTheDocument();
    });

    it('should render Table Item text: Logout if action is not login', () => {
        response.data.formatted_data[0].action = 'logout';
        renderComponent();
        expect(screen.getByText(/logout/i)).toBeInTheDocument();
    });

    it('should render Table Item text: Failed under status if status is not 1', () => {
        response.data.formatted_data[0].status = 'failed';
        renderComponent();
        expect(screen.getByText(/failed/i)).toBeInTheDocument();
    });
});
