import * as React from 'react';
import { APIProvider, useSubscription } from '@deriv/api';
import { renderHook } from '@testing-library/react-hooks';
import useCryptoTransactions from '../useCryptoTransactions';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useSubscription: jest.fn(),
}));

const mockUseSubscription = useSubscription as jest.MockedFunction<typeof useSubscription<'cashier_payments'>>;

describe('useCryptoTransactions', () => {
    test("should return an empty list if the user doesn't have any crypto transactions", () => {
        // @ts-expect-error need to come up with a way to mock the return type of useSubscription
        mockUseSubscription.mockReturnValue({
            subscribe: jest.fn(),
        });

        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useCryptoTransactions(), { wrapper });

        expect(result.current.data).toBe(undefined);
    });

    test('should return the list of crypto transactions', () => {
        // @ts-expect-error need to come up with a way to mock the return type of useSubscription
        mockUseSubscription.mockReturnValue({
            data: {
                cashier_payments: {
                    crypto: [
                        {
                            address_hash: 'tb1ql7w62elx9ucw4pj5lgw4l028hmuw80sndtntxt',
                            address_url:
                                'https://www.blockchain.com/btc-testnet/address/tb1ql7w62elx9ucw4pj5lgw4l028hmuw80sndtntxt',
                            amount: 0.69,
                            id: '4',
                            is_valid_to_cancel: 0,
                            status_code: 'LOCKED',
                            status_message:
                                "We're reviewing your withdrawal request. You may still cancel this transaction if you wish. Once we start processing, you won't be able to cancel.",
                            submit_date: 1640603927,
                            transaction_type: 'withdrawal',
                        },
                        {
                            address_hash: '4l028hmuw80sndtntxttb1ql7w62elx9ucw4pj5lgw',
                            address_url:
                                'https://www.blockchain.com/btc-testnet/address/4l028hmuw80sndtntxttb1ql7w62elx9ucw4pj5lgw',
                            amount: 0.42069,
                            id: '69',
                            is_valid_to_cancel: 1,
                            status_code: 'PENDING',
                            status_message:
                                "We're reviewing your withdrawal request. You may still cancel this transaction if you wish. Once we start processing, you won't be able to cancel.",
                            submit_date: 1640606927,
                            transaction_type: 'deposit',
                        },
                    ],
                },
            },
            subscribe: jest.fn(),
        });

        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useCryptoTransactions(), { wrapper });

        expect(result.current.data?.length).toBe(2);
        expect(result.current.data?.[0].is_deposit).toBe(true);
        expect(result.current.has_transactions).toBe(true);
        expect(result.current.last_transaction?.id).toBe('69');
    });
});
