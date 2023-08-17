import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import useActiveTradingAccount from '../useActiveTradingAccount';
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
                        loginid: 'MXN000000',
                    },
                },
            };
        }

        return { data: undefined };
    }),
}));

describe('useActiveTradingAccount', () => {
    it('should return active trading account', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useActiveTradingAccount(), { wrapper });

        expect(result?.current?.is_active).toEqual(true);
        expect(result?.current?.loginid).toEqual('MXN000000');
    });
});
