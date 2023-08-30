import React from 'react';
import { screen, render } from '@testing-library/react';
import { useLoginHistory, APIProvider } from '@deriv/api';
import { isMobile } from '@deriv/shared';
import LoginHistory from '../login-history';
import { StoreProvider, mockStore } from '@deriv/stores';

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
        login_history: [
            {
                date: '',
                browser: '',
                action: '',
                status: '',
                ip: '',
            },
        ],
        isLoading: false,
        isError: false,
        error: '',
    };
    beforeEach(() => {
        (isMobile as jest.Mock).mockReturnValue(false);
        mock_store = mockStore({
            client: {
                is_switching: false,
                is_authorize: true,
            },
        });

        response = {
            login_history: [
                {
                    date: '2023-08-28 03:11:45 GMT',
                    browser: '"Chrome  v116.0.0.0"',
                    action: 'login',
                    status: 'successful',
                    ip: '175.143.37.57',
                },
            ],
            isLoading: false,
            isError: false,
            error: 'this is an error message',
        };
    });

    it('should render Login History List when isMobile is true', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock_store}>{children}</StoreProvider>
            </APIProvider>
        );
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseLoginHistory.mockReturnValue(response);
        const { container } = render(<LoginHistory />, { wrapper });
        expect(container).toBeInTheDocument();
        expect(screen.getByText(/date and time/i)).toHaveClass('dc-text login-history__list__row__cell--title');
    });

    it('should render Login History Table', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock_store}>{children}</StoreProvider>
            </APIProvider>
        );
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseLoginHistory.mockReturnValue(response);
        const { container } = render(<LoginHistory />, { wrapper });
        expect(container).toBeInTheDocument();
        expect(screen.getByText(/date and time/i)).not.toHaveClass('dc-text login-history__list__row__cell--title');
    });

    it('should render Table Header.', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock_store}>{children}</StoreProvider>
            </APIProvider>
        );
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseLoginHistory.mockReturnValue(response);
        render(<LoginHistory />, { wrapper });
        const table_headers = [/date and time/i, /action/i, /browser/i, /ip address/i, /status/i];
        table_headers.forEach(header => {
            expect(screen.getByText(header)).toBeInTheDocument();
        });
    });

    it('should render Table Items.', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock_store}>{children}</StoreProvider>
            </APIProvider>
        );
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseLoginHistory.mockReturnValue(response);
        render(<LoginHistory />, { wrapper });
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
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock_store}>{children}</StoreProvider>
            </APIProvider>
        );
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseLoginHistory.mockReturnValue(response);
        render(<LoginHistory />, { wrapper });
        expect(screen.getByTestId('dt_initial_loader')).toBeInTheDocument();
    });

    it('should render Loading with classname account__initial-loader if isLoading is true', () => {
        response.isLoading = true;
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock_store}>{children}</StoreProvider>
            </APIProvider>
        );
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseLoginHistory.mockReturnValue(response);
        render(<LoginHistory />, { wrapper });
        expect(screen.getByTestId('dt_initial_loader')).toHaveClass('initial-loader account__initial-loader');
    });

    it('should render Error with error message', () => {
        response.isError = true;
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock_store}>{children}</StoreProvider>
            </APIProvider>
        );
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseLoginHistory.mockReturnValue(response);
        render(<LoginHistory />, { wrapper });
        expect(screen.getByText(/this is an error message/i)).toBeInTheDocument();
    });

    it('should render Table Item text: Logout under action is action is not login', () => {
        response.login_history[0].action = 'logout';
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock_store}>{children}</StoreProvider>
            </APIProvider>
        );
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseLoginHistory.mockReturnValue(response);
        render(<LoginHistory />, { wrapper });
        expect(screen.getByText(/logout/i)).toBeInTheDocument();
    });

    it('should render Table Item text: Failed under status if status is not 1', () => {
        response.login_history[0].status = 'failed';
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock_store}>{children}</StoreProvider>
            </APIProvider>
        );
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseLoginHistory.mockReturnValue(response);
        render(<LoginHistory />, { wrapper });
        expect(screen.getByText(/failed/i)).toBeInTheDocument();
    });
});
