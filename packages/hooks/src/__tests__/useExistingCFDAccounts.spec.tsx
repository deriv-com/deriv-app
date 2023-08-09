import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { APIProvider } from '@deriv/api';
import useExistingCFDAccounts from '../useExistingCFDAccounts';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(name => {
        if (name === 'authorize') {
            return {
                data: {
                    account_list: [
                        {
                            account_category: 'wallet',
                            currency: 'USD',
                            is_virtual: 1,
                            linked_to: [
                                {
                                    loginid: 'CRW909900',
                                    platform: 'mt5',
                                },
                            ],
                        },
                    ],
                },
            };
        }
        if (name === 'mt5_login_list') {
            return {
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
                },
            };
        }
        if (name === 'trading_platform_accounts') {
            return {
                data: {
                    trading_platform_accounts: [
                        {
                            account_id: 'DXR1646584',
                            account_type: 'real',
                            balance: 0,
                            currency: 'USD',
                            display_balance: '0.00',
                            enabled: 1,
                            landing_company_short: 'svg',
                            login: '8807230',
                            market_type: 'all',
                            platform: 'dxtrade',
                        },
                        {
                            account_type: 'real',
                            balance: 0,
                            country: 'za',
                            currency: 'USD',
                            display_balance: '0.00',
                            email: 'mei+za1@binary.com',
                            group: 'real\\p02_ts01\\all\\svg_ez_usd',
                            landing_company_short: 'svg',
                            leverage: 1000,
                            login: 'EZR80001086',
                            market_type: 'all',
                            name: 'Baily Pan',
                            server: 'p02_ts01',
                            server_info: {
                                environment: 'Deriv-Server-02',
                                geolocation: {
                                    group: 'africa_derivez',
                                    location: 'South Africa',
                                    region: 'Africa',
                                    sequence: 2,
                                },
                                id: 'p02_ts01',
                            },
                        },
                    ],
                },
            };
        }
        return { data: undefined };
    }),
}));

describe('useExistingCFDAccounts', () => {
    it('should return the existing cfd accounts', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;
        const { result } = renderHook(() => useExistingCFDAccounts(), { wrapper });

        expect(result.current.data.dxtrade_accounts).toEqual([
            {
                account_id: 'DXR1646584',
                account_type: 'real',
                balance: 0,
                currency: 'USD',
                display_balance: '0.00',
                enabled: 1,
                is_added: true,
                landing_company_short: 'svg',
                login: '8807230',
                loginid: 'DXR1646584',
                market_type: 'all',
                platform: 'dxtrade',
                transfer_icon: 'IcRebrandingDerivX',
            },
            {
                account_type: 'real',
                balance: 0,
                country: 'za',
                currency: 'USD',
                display_balance: '0.00',
                email: 'mei+za1@binary.com',
                group: 'real\\p02_ts01\\all\\svg_ez_usd',
                is_added: true,
                landing_company_short: 'svg',
                leverage: 1000,
                login: 'EZR80001086',
                loginid: undefined,
                market_type: 'all',
                name: 'Baily Pan',
                server: 'p02_ts01',
                server_info: {
                    environment: 'Deriv-Server-02',
                    geolocation: { group: 'africa_derivez', location: 'South Africa', region: 'Africa', sequence: 2 },
                    id: 'p02_ts01',
                },
                transfer_icon: 'IcRebrandingDerivX',
            },
        ]);

        expect(result.current.data.derivez_accounts).toEqual(
            expect.arrayContaining([
                {
                    account_type: 'real',
                    balance: 0,
                    country: 'za',
                    currency: 'USD',
                    display_balance: '0.00',
                    email: 'mei+za1@binary.com',
                    group: 'real\\p02_ts01\\all\\svg_ez_usd',
                    landing_company_short: 'svg',
                    leverage: 1000,
                    login: 'EZR80001086',
                    loginid: 'EZR80001086',
                    market_type: 'all',
                    name: 'Baily Pan',
                    server: 'p02_ts01',
                    server_info: {
                        environment: 'Deriv-Server-02',
                        geolocation: {
                            group: 'africa_derivez',
                            location: 'South Africa',
                            region: 'Africa',
                            sequence: 2,
                        },
                        id: 'p02_ts01',
                    },
                    transfer_icon: 'IcRebrandingDerivEz',
                },
            ])
        );
    });
});
