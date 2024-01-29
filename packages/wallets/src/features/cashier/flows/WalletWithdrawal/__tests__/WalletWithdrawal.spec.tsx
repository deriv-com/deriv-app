import React from 'react';
import { useActiveWalletAccount, useCurrencyConfig } from '@deriv/api';
import { render } from '@testing-library/react';
import WalletWithdrawal from '../WalletWithdrawal';

jest.mock('../../../modules', () => ({
    ...jest.requireActual('../../../modules'),
    WithdrawalCryptoModule: jest.fn(() => <div>WithdrawalCryptoModule</div>),
    WithdrawalFiatModule: jest.fn(() => <div>WithdrawalFiatModule</div>),
    WithdrawalVerificationModule: jest.fn(() => <div>WithdrawalVerificationModule</div>),
}));

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useActiveWalletAccount: jest.fn(),
    useCurrencyConfig: jest.fn(),
}));

const mockUseActiveWalletAccount = useActiveWalletAccount as jest.MockedFunction<typeof useActiveWalletAccount>;

const mockUseCurrencyConfig = useCurrencyConfig as jest.MockedFunction<typeof useCurrencyConfig>;

describe('<WalletWithdrawal />', () => {
    const originalWindowLocation = window.location;

    beforeEach(() => {
        Object.defineProperty(window, 'location', {
            configurable: true,
            enumerable: true,
            value: new URL('https://localhost:8443/redirect?verification=a4b2c0x6y9z'),
        });
    });

    afterEach(() => {
        Object.defineProperty(window, 'location', {
            configurable: true,
            // enumerable: true,
            value: originalWindowLocation,
        });
    });

    it('remove the `verification` param from the url', () => {
        mockUseActiveWalletAccount.mockReturnValue({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            data: {
                currency: 'USD',
            },
        });

        // @ts-expect-error - since this is a mock, we only need partial properties of the hook
        mockUseCurrencyConfig.mockReturnValue({
            getConfig: jest.fn(),
            isSuccess: true,
        });

        render(<WalletWithdrawal />);
    });
});
