import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import useFilteredCFDAccounts from '../useFilteredCFDAccounts';
import { APIProvider, useFetch } from '@deriv/api';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(name => {
        if (name === 'authorize') {
            return {
                data: {
                    authorize: {
                        account_list: [
                            {
                                loginid: 'CRW000000',
                                account_category: 'wallet',
                                is_virtual: 0,
                                landing_company_name: 'maltainvest',
                                currency: 'USD',
                            },
                        ],
                        loginid: 'CRW000000',
                        country: 'id',
                        is_virtual: 0,
                    },
                },
            };
        } else if (name === 'trading_platform_available_accounts') {
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
        } else if (name === 'mt5_login_list') {
            return {
                data: {
                    mt5_login_list: [
                        {
                            platform: 'mt5',
                            display_login: 'CRW909900',
                            email: '',
                            leverage: '10012123123',
                            login: 'CRW909900',
                            server: 'Deriv-Server',
                            server_description: 'Deriv-Server',
                            type: 'real',
                            landing_company_short: 'svg',
                            market_type: 'synthetic',
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
                    type: 'real',
                    landing_company_short: 'svg',
                    market_type: 'synthetic',
                    platform: 'mt5',
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
                    platform: 'mt5',
                },
            ],
        },
        mutate: jest.fn,
    })),
}));

const mockUseFetch = useFetch as jest.MockedFunction<typeof useFetch<'trading_platform_available_accounts'>>;

describe('useFilteredCFDAccounts', () => {
    it('should return filteredCFDAccounts', async () => {
        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useFilteredCFDAccounts(), { wrapper });

        expect(result.current.data).toMatchObject({
            synthetic: [
                {
                    availability: 'Non-EU',
                    icon: 'Derived',
                    is_added: true,
                    market_type: 'synthetic',
                    name: 'Deriv SVG',
                    short_code_and_region: 'SVG',
                    shortcode: 'svg',
                },
            ],
            financial: [
                {
                    availability: 'All',
                    icon: 'Financial',
                    is_added: false,
                    market_type: 'financial',
                    name: 'Deriv SVG',
                    platform: 'mt5',
                    short_code_and_region: 'BVI',
                    shortcode: 'bvi',
                },
            ],
            all: [
                {
                    availability: 'All',
                    icon: 'SwapFree',
                    is_added: false,
                    market_type: 'all',
                    name: 'Swap Free',
                    platform: 'mt5',
                    short_code_and_region: 'SVG',
                    shortcode: 'svg',
                },
            ],
        });
    });

    it('should return gaming, financial then all in the correct order', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useFilteredCFDAccounts(), { wrapper });

        expect(result.current.data).toMatchObject({
            synthetic: [
                {
                    availability: 'Non-EU',
                    icon: 'Derived',
                    is_added: true,
                    market_type: 'synthetic',
                    name: 'Deriv SVG',
                    short_code_and_region: 'SVG',
                    shortcode: 'svg',
                },
            ],
            financial: [
                {
                    availability: 'All',
                    icon: 'Financial',
                    is_added: false,
                    market_type: 'financial',
                    name: 'Deriv SVG',
                    platform: 'mt5',
                    short_code_and_region: 'BVI',
                    shortcode: 'bvi',
                },
            ],
            all: [
                {
                    availability: 'All',
                    icon: 'SwapFree',
                    is_added: false,
                    market_type: 'all',
                    name: 'Swap Free',
                    platform: 'mt5',
                    short_code_and_region: 'SVG',
                    shortcode: 'svg',
                },
            ],
        });
    });

    it('should return undefined if there is no data', () => {
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({});

        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useFilteredCFDAccounts(), { wrapper });

        expect(result.current.data).toEqual({});
    });
});
