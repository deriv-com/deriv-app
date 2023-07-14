import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import useFilteredCFDAccounts from '../useFilteredCFDAccounts';
import { StoreProvider, mockStore } from '@deriv/stores';
import { useFetch } from '@deriv/api';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(name => {
        if (name === 'trading_platform_available_accounts') {
            return {
                data: {
                    trading_platform_available_accounts: [
                        {
                            availability: 'Non-EU',
                            icon: 'Derived',
                            market_type: 'gaming',
                            name: 'Deriv SVG',
                            platform: 'mt5',
                            shortcode: 'svg',
                        },
                        {
                            availability: 'Non-EU',
                            icon: 'Derived',
                            market_type: 'gaming',
                            name: 'Deriv SVG',
                            platform: 'mt5',
                            shortcode: 'vanuatu',
                        },
                        {
                            availability: 'Non-EU',
                            icon: 'Financial',
                            market_type: 'financial',
                            name: 'Deriv SVG',
                            platform: 'mt5',
                            shortcode: 'bvi',
                        },
                        {
                            availability: 'Non-EU',
                            icon: 'swapfree',
                            market_type: 'all',
                            name: 'Swap Free',
                            platform: 'mt5',
                            shortcode: 'svg',
                        },
                    ],
                },
            };
        }
        return { data: undefined };
    }),
    useRequest: jest.fn(() => ({
        data: {
            mt5_login_list: [
                {
                    display_login: 'CRW909900',
                    email: '',
                    leverage: '10012123123',
                    login: 'CRW909900',
                    server: 'Deriv-Server',
                    server_description: 'Deriv-Server',
                    type: 'demo',
                },
            ],

            trading_platform_accounts: [
                {
                    account_type: 'financial',
                    email: '',
                    id: 'CRW909900',
                    is_disabled: 0,
                    is_virtual: 1,
                    leverage: '1000',
                    login: 'CRW909900',
                    server: 'Deriv-Server',
                    server_description: 'Deriv-Server',
                    short_title: 'CRW909900',
                    title: 'CRW909900',
                    type: 'demo',
                },
            ],
        },
        mutate: jest.fn,
    })),
}));

const mockUseFetch = useFetch as jest.MockedFunction<typeof useFetch<'trading_platform_available_accounts'>>;

describe('useFilteredCFDAccounts', () => {
    it('should return filteredCFDAccounts', async () => {
        const mock = mockStore({ client: { accounts: { CRW909900: { token: '12345' } }, loginid: 'CRW909900' } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useFilteredCFDAccounts(), { wrapper });

        expect(result.current.data).toEqual([
            {
                availability: 'Non-EU',
                icon: 'Derived',
                is_added: false,
                market_type: 'synthetic',
                name: 'Deriv SVG',
                platform: 'mt5',
                shortcode: 'svg',
            },
            {
                availability: 'All',
                icon: 'Financial',
                is_added: false,
                market_type: 'financial',
                name: 'Deriv SVG',
                platform: 'mt5',
                shortcode: 'bvi',
            },
            {
                availability: 'All',
                icon: 'SwapFree',
                market_type: 'all',
                name: 'Swap Free',
                is_added: false,
                platform: 'mt5',
                shortcode: 'svg',
            },
        ]);
    });

    it('should return gaming, financial then all in the correct order', () => {
        const mock = mockStore({ client: { accounts: { CRW909900: { token: '12345' } }, loginid: 'CRW909900' } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useFilteredCFDAccounts(), { wrapper });

        expect(result.current.data).toEqual([
            {
                availability: 'Non-EU',
                icon: 'Derived',
                is_added: false,
                market_type: 'synthetic',
                name: 'Deriv SVG',
                platform: 'mt5',
                shortcode: 'svg',
            },
            {
                availability: 'All',
                icon: 'Financial',
                is_added: false,
                market_type: 'financial',
                name: 'Deriv SVG',
                platform: 'mt5',
                shortcode: 'bvi',
            },
            {
                availability: 'All',
                icon: 'SwapFree',
                market_type: 'all',
                name: 'Swap Free',
                is_added: false,
                platform: 'mt5',
                shortcode: 'svg',
            },
        ]);
    });

    it('should return undefined if there is no data', () => {
        const mock = mockStore({ client: { accounts: { CRW909900: { token: '12345' } }, loginid: 'CRW909900' } });
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useFilteredCFDAccounts(), { wrapper });

        expect(result.current.data).toBeUndefined();
    });
});
