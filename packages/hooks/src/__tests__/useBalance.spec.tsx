import * as React from 'react';
import { APIProvider } from '@deriv/api';
import { renderHook } from '@testing-library/react-hooks';
import useBalance from '../useBalance';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn((name: string) => {
        if (name === 'authorize') {
            return {
                data: {
                    authorize: {
                        account_list: [
                            {
                                account_category: 'wallet',
                                landing_company_name: 'svg',
                                is_virtual: 0,
                                currency: 'USD',
                                loginid: 'CR1003',
                            },
                        ],
                    },
                },
            };
        } else if (name === 'balance') {
            return {
                data: {
                    balance: {
                        accounts: {
                            CR1003: {
                                balance: 179,
                            },
                        },
                    },
                },
            };
        }

        return undefined;
    }),
}));

describe('useBalance', () => {
    test('should return correct balance', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useBalance(), { wrapper });

        expect(result.current.data?.accounts?.CR1003?.balance).toEqual(179);
    });
});
