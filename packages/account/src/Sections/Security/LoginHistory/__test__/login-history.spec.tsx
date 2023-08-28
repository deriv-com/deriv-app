import React from 'react';
import { screen, render } from '@testing-library/react';
import { useFetch, APIProvider } from '@deriv/api';
import { isMobile } from '@deriv/shared';
import LoginHistory from '../login-history';
import { StoreProvider, mockStore } from '@deriv/stores';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
}));

const mockUseFetch = useFetch as jest.MockedFunction<typeof useFetch<'login_history'>>;

describe('<LoginHistory />', () => {
    let mock_store = mockStore({});
    let response = {
        data: {
            login_history: [
                {
                    environment: '',
                    action: '',
                    status: 1,
                    time: 0,
                },
            ],
        },
        isLoading: false,
        isError: false,
        error: '',
    };
    beforeEach(() => {
        (isMobile as jest.Mock).mockReturnValue(false);
        mock_store = mockStore({
            client: {
                is_switching: false,
            },
        });

        response = {
            data: {
                login_history: [
                    {
                        environment:
                            '28-Aug-23 03:11:01GMT IP=175.143.37.57 IP_COUNTRY=MY User_AGENT=Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36 LANG=EN',
                        action: 'login',
                        status: 1 as const,
                        time: 2100,
                    },
                ],
            },
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
        mockUseFetch.mockReturnValue(response);
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
        mockUseFetch.mockReturnValue(response);
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
        mockUseFetch.mockReturnValue(response);
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
        mockUseFetch.mockReturnValue(response);
        render(<LoginHistory />, { wrapper });
        const table_items = [
            /invalid date 03:11:01 GMT/i,
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
        mockUseFetch.mockReturnValue(response);
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
        mockUseFetch.mockReturnValue(response);
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
        mockUseFetch.mockReturnValue(response);
        render(<LoginHistory />, { wrapper });
        expect(screen.getByText(/this is an error message/i)).toBeInTheDocument();
    });

    it('should render Table Item text: Logout under action is action is not login', () => {
        response.data.login_history[0].action = 'logout';
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock_store}>{children}</StoreProvider>
            </APIProvider>
        );
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue(response);
        render(<LoginHistory />, { wrapper });
        expect(screen.getByText(/logout/i)).toBeInTheDocument();
    });

    it('should render Table Item text: Failed under status if status is not 1', () => {
        response.data.login_history[0].status = 0;
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock_store}>{children}</StoreProvider>
            </APIProvider>
        );
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue(response);
        render(<LoginHistory />, { wrapper });
        expect(screen.getByText(/failed/i)).toBeInTheDocument();
    });
});
