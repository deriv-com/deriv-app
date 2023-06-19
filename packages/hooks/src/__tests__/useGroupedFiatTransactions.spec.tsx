import * as React from 'react';
import { Statement } from '@deriv/api-types';
import { renderHook } from '@testing-library/react-hooks';
import useGroupedFiatTransactions from '../useGroupedFiatTransactions';

describe('useGroupedFiatTransactions', () => {
    test('should return empty array when client has no fiat transactions', async () => {
        const mock_transaction_list = [] as Statement['transactions'];

        const { result } = renderHook(() => useGroupedFiatTransactions(mock_transaction_list));

        expect(result.current).toEqual({});
    });

    test('should group transactions of the same day in one day', () => {
        const mock_transaction_list = [
            {
                action_type: 'initial_fund',
                amount: 42,
                app_id: 1,
                balance_after: 42,
                contract_id: 1,
                longcode: '',
                payout: 1,
                reference_id: {},
                shortcode: '',
                transaction_id: 1,
                transaction_time: 1685109944,
            },
            {
                action_type: 'reset_balance',
                amount: -42,
                app_id: 1,
                balance_after: 0,
                contract_id: 1,
                longcode: '',
                payout: 1,
                purchase_time: 1685109944,
                reference_id: {},
                shortcode: '',
                transaction_id: 2,
                transaction_time: 1685109944,
            },
        ] as unknown as Statement['transactions'];

        const { result } = renderHook(() => useGroupedFiatTransactions(mock_transaction_list));

        expect(result.current).toEqual({
            '26 May 2023': [
                {
                    action_type: 'initial_fund',
                    amount: 42,
                    app_id: 1,
                    balance_after: 42,
                    contract_id: 1,
                    longcode: '',
                    payout: 1,
                    reference_id: {},
                    shortcode: '',
                    transaction_id: 1,
                    transaction_time: 1685109944,
                },
                {
                    action_type: 'reset_balance',
                    amount: -42,
                    app_id: 1,
                    balance_after: 0,
                    contract_id: 1,
                    longcode: '',
                    payout: 1,
                    purchase_time: 1685109944,
                    reference_id: {},
                    shortcode: '',
                    transaction_id: 2,
                    transaction_time: 1685109944,
                },
            ],
        });
    });
});
