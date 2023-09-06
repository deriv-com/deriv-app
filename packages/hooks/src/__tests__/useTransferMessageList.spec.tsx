import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { StoreProvider, mockStore } from '@deriv/stores';
import useTransferMessageList from '../useTransferMessageList';
import useWalletTransfer from '../useWalletTransfer';

const mock_from_account = {
    account_type: 'wallet',
    balance: 0,
    currency: 'USD',
    loginid: 'CRW123',
    display_currency_code: 'USD',
    shortcode: 'svg',
} as ReturnType<typeof useWalletTransfer>['from_account'];

const mock_to_account = {
    account_type: 'trading',
    balance: 0,
    currency: 'USD',
    loginid: 'CR123',
    display_currency_code: 'USD',
    shortcode: 'svg',
} as ReturnType<typeof useWalletTransfer>['to_account'];

jest.mock('../useTransferMessageBetweenWalletAndTradingApp', () =>
    jest.fn(() => [
        {
            code: 'WalletToTradingAppDailyLimit',
            is_first_transfer: false,
            limit: 9000,
            currency: 'USD',
            type: 'success',
        },
    ])
);

describe('useTransferMessageList', () => {
    it('should get return the generated message list', () => {
        const { result } = renderHook(() => useTransferMessageList(mock_from_account, mock_to_account));

        expect(result.current.data).toStrictEqual([
            {
                code: 'WalletToTradingAppDailyLimit',
                is_first_transfer: false,
                limit: 9000,
                currency: 'USD',
                type: 'success',
            },
        ]);
    });
});
