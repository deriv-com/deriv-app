import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import useActiveWalletAccount from '../useActiveWalletAccount';
import { APIProvider } from '@deriv/api';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn((name: string) => {
        if (name === 'balance') {
            return {
                data: {
                    balance: {
                        accounts: {
                            CRW000000: {
                                balance: 100,
                            },
                        },
                    },
                },
            };
        }
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
                            {
                                loginid: 'MXN000000',
                                account_category: 'trading',
                                is_virtual: 0,
                                landing_company_name: 'maltainvest',
                                currency: 'BTC',
                            },
                        ],
                        loginid: 'CRW000000',
                    },
                },
            };
        }

        return { data: undefined };
    }),
}));

describe('useActiveWalletAccount', () => {
    it('should return active wallet account', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useActiveWalletAccount(), { wrapper });

        expect(result?.current?.is_active).toEqual(true);
        expect(result?.current?.loginid).toEqual('CRW000000');
    });
});
