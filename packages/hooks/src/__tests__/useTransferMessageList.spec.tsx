import { renderHook } from '@testing-library/react-hooks';
import useTransferMessageList from '../useTransferMessageList';
import useWalletTransfer from '../useWalletTransfer';

const mock_from_account: Partial<ReturnType<typeof useWalletTransfer>['from_account']> = {
    account_type: 'wallet',
    balance: 0,
    currency: 'USD',
    loginid: 'CRW123',
    display_currency_code: 'USD',
    shortcode: 'svg',
};

const mock_to_account: Partial<ReturnType<typeof useWalletTransfer>['to_account']> = {
    account_type: 'trading',
    balance: 0,
    currency: 'USD',
    loginid: 'CR123',
    display_currency_code: 'USD',
    shortcode: 'svg',
};

jest.mock('../useTransferMessageListBetweenWalletAndTradingApp', () =>
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
        const { result } = renderHook(() => useTransferMessageList(mock_from_account, mock_to_account, false));

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
