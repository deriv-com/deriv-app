import React from 'react';

import { APIProvider } from '@deriv/api';
import { mockStore, StoreProvider } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';

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
                    ],
                },
            };
        }

        return { data: undefined };
    }),
}));

describe('useExistingCFDAccounts', () => {
    it('should return the existing cfd accounts', () => {
        const mock = mockStore({
            client: { accounts: { CRW909900: { token: '12345' } }, loginid: 'CRW909900' },
            traders_hub: {
                combined_cfd_mt5_accounts: [
                    {
                        platform: 'mt5',
                        description: 'Deriv-Server',
                        icon: 'Derived',
                        sub_title: 'sub_name',
                        name: 'Derived',
                    },
                ],
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );
        const { result } = renderHook(() => useExistingCFDAccounts(), { wrapper });

        expect(result.current.data.dxtrade_accounts).toEqual(
            expect.arrayContaining([
                {
                    account_id: 'DXR1646584',
                    account_type: 'real',
                    balance: 0,
                    currency: 'USD',
                    display_balance: '0.00',
                    enabled: 1,
                    landing_company_short: 'svg',
                    login: '8807230',
                    loginid: 'DXR1646584',
                    market_type: 'all',
                    platform: 'dxtrade',
                    transfer_icon: 'IcRebrandingDerivX',
                },
            ])
        );
    });
});
