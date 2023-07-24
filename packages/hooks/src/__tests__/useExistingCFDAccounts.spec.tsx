import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { StoreProvider, mockStore } from '@deriv/stores';
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
            };
        }
        return { data: undefined };
    }),
}));

describe('useExistingCFDAccounts', () => {
    it('should return the existing cfd accounts', () => {
        const mock = mockStore({
            client: { accounts: { CRW909900: { token: '12345' } }, loginid: 'CRW909900' },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );
        const { result } = renderHook(() => useExistingCFDAccounts(), { wrapper });

        expect(result.current.data.dxtrade_accounts).toEqual([
            {
                account_type: 'financial',
                email: '',
                id: 'CRW909900',
                is_added: true,
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
        ]);

        expect(result.current.data.derivez_accounts).toEqual([
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
        ]);
    });
});
