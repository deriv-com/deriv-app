import React from 'react';
import { Localize } from '@deriv-com/translations';
import cumulativeAccountLimitsMessageFn from '../cumulativeAccountLimitsMessageFn';

const mockDisplayMoney = jest.fn((amount, currency, decimals) => `${amount.toFixed(decimals)} ${currency}`);

const fiatAccount = {
    account_category: 'wallet',
    account_type: 'doughflow',
    accountName: 'Fiat Account',
    currency: 'USD',
    currencyConfig: { display_code: 'USD', fractional_digits: 2 },
};

const fiatEURAccount = {
    account_category: 'wallet',
    account_type: 'doughflow',
    accountName: 'Fiat EUR Account',
    currency: 'EUR',
    currencyConfig: { display_code: 'EUR', fractional_digits: 2 },
};

const tradingAccount = {
    account_category: 'trading',
    account_type: 'standard',
    accountName: 'Trading Account',
    currency: 'USD',
    currencyConfig: { display_code: 'USD', fractional_digits: 2 },
};

describe('cumulativeAccountLimitsMessageFn', () => {
    it('returns null if targetAccount is not provided', () => {
        const result = cumulativeAccountLimitsMessageFn({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            sourceAccount: {},
            targetAccount: undefined,
        });
        expect(result).toBeNull();
    });

    it('handles demo transfer with full limit available', () => {
        const result = cumulativeAccountLimitsMessageFn({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            activeWallet: { is_virtual: true },
            activeWalletExchangeRates: {},
            displayMoney: mockDisplayMoney,
            limits: {
                daily_cumulative_amount_transfers: {
                    virtual: {
                        allowed: 1000,
                        available: 1000,
                    },
                },
            },
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            sourceAccount: fiatAccount,
            sourceAmount: 100,
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            targetAccount: fiatAccount,
        });
        expect(result).toEqual({
            message: (
                <Localize
                    i18n_default_text='Your daily transfer limit for virtual funds is {{formattedDemoLimit}}'
                    values={{ formattedDemoLimit: '1000.00 USD' }}
                />
            ),
            type: 'success',
        });
    });

    it('handles demo transfer with partial limit available', () => {
        const result = cumulativeAccountLimitsMessageFn({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            activeWallet: { is_virtual: true },
            activeWalletExchangeRates: {},
            displayMoney: mockDisplayMoney,
            limits: {
                daily_cumulative_amount_transfers: {
                    virtual: {
                        allowed: 1000,
                        available: 500,
                    },
                },
            },
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            sourceAccount: fiatAccount,
            sourceAmount: 100,
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            targetAccount: fiatAccount,
        });
        expect(result).toEqual({
            message: (
                <Localize
                    i18n_default_text='Your remaining daily transfer limit for virtual funds is {{formattedDemoLimit}}.'
                    values={{ formattedDemoLimit: '500.00 USD' }}
                />
            ),
            type: 'success',
        });
    });

    it('handles real account transfer with available limit for wallets', () => {
        const result = cumulativeAccountLimitsMessageFn({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            activeWallet: { currency: 'USD', is_virtual: false },
            displayMoney: mockDisplayMoney,
            limits: {
                daily_cumulative_amount_transfers: {
                    internal: {
                        allowed: 1000,
                        available: 800,
                    },
                },
            },
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            sourceAccount: fiatAccount,
            sourceAmount: 100,
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            targetAccount: fiatAccount,
        });
        expect(result).toEqual({
            message: (
                <Localize
                    i18n_default_text='The remaining daily transfer limit between your Wallets is {{formattedSourceCurrencyRemainder}}.'
                    values={{ formattedSourceCurrencyRemainder: '800.00 USD' }}
                />
            ),
            type: 'success',
        });
    });

    it('handles real account transfer with available limit for non-wallets', () => {
        const result = cumulativeAccountLimitsMessageFn({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            activeWallet: { currency: 'USD', is_virtual: false },
            displayMoney: mockDisplayMoney,
            limits: {
                daily_cumulative_amount_transfers: {
                    dtrade: {
                        allowed: 1000,
                        available: 800,
                    },
                },
            },
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            sourceAccount: tradingAccount,
            sourceAmount: 100,
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            targetAccount: fiatAccount,
        });
        expect(result).toEqual({
            message: (
                <Localize
                    i18n_default_text='The remaining daily transfer limit between your {{sourceAccountName}} and {{targetAccountName}} is {{formattedSourceCurrencyRemainder}}.'
                    values={{
                        formattedSourceCurrencyRemainder: '800.00 USD',
                        sourceAccountName: tradingAccount.accountName,
                        targetAccountName: fiatAccount.accountName,
                    }}
                />
            ),
            type: 'success',
        });
    });

    it('handles real account transfer with equal allowed and available limits for wallets', () => {
        const result = cumulativeAccountLimitsMessageFn({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            activeWallet: { currency: 'USD', is_virtual: false },
            activeWalletExchangeRates: { rates: { EUR: 0.85 } },
            displayMoney: mockDisplayMoney,
            limits: {
                daily_cumulative_amount_transfers: {
                    internal: {
                        allowed: 1000,
                        available: 1000,
                    },
                },
            },
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            sourceAccount: fiatAccount,
            sourceAmount: 100,
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            targetAccount: fiatAccount,
        });
        expect(result).toEqual({
            message: (
                <Localize
                    i18n_default_text='The daily transfer limit between your Wallets is {{formattedSourceCurrencyLimit}}.'
                    values={{ formattedSourceCurrencyLimit: '1000.00 USD' }}
                />
            ),
            type: 'success',
        });
    });

    it('handles real account transfer with equal allowed and available limits for non-wallets', () => {
        const result = cumulativeAccountLimitsMessageFn({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            activeWallet: { currency: 'USD', is_virtual: false },
            activeWalletExchangeRates: { rates: { EUR: 0.85 } },
            displayMoney: mockDisplayMoney,
            limits: {
                daily_cumulative_amount_transfers: {
                    dtrade: {
                        allowed: 1000,
                        available: 1000,
                    },
                },
            },
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            sourceAccount: tradingAccount,
            sourceAmount: 100,
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            targetAccount: fiatAccount,
        });
        expect(result).toEqual({
            message: (
                <Localize
                    i18n_default_text='The daily transfer limit between your {{sourceAccountName}} and {{targetAccountName}} is {{formattedSourceCurrencyLimit}}.'
                    values={{
                        formattedSourceCurrencyLimit: '1000.00 USD',
                        sourceAccountName: tradingAccount.accountName,
                        targetAccountName: fiatAccount.accountName,
                    }}
                />
            ),
            type: 'success',
        });
    });

    it('handles real account transfer with no available limit for wallets', () => {
        const result = cumulativeAccountLimitsMessageFn({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            activeWallet: { currency: 'USD', is_virtual: false },
            activeWalletExchangeRates: { rates: { EUR: 0.85 } },
            displayMoney: mockDisplayMoney,
            limits: {
                daily_cumulative_amount_transfers: {
                    internal: {
                        allowed: 1000,
                        available: 0,
                    },
                },
            },
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            sourceAccount: fiatAccount,
            sourceAmount: 100,
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            targetAccount: fiatAccount,
        });
        expect(result).toEqual({
            message: (
                <Localize
                    i18n_default_text='You have reached your daily transfer limit of {{formattedSourceCurrencyLimit}} between your Wallets. The limit will reset at 00:00 GMT.'
                    values={{ formattedSourceCurrencyLimit: '1000.00 USD' }}
                />
            ),
            type: 'error',
        });
    });

    it('handles real account transfer with no available limit for non-wallets', () => {
        const result = cumulativeAccountLimitsMessageFn({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            activeWallet: { currency: 'USD', is_virtual: false },
            activeWalletExchangeRates: { rates: { EUR: 0.85, USD: 1 } },
            displayMoney: mockDisplayMoney,
            limits: {
                daily_cumulative_amount_transfers: {
                    dtrade: {
                        allowed: 1000,
                        available: 0,
                    },
                },
            },
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            sourceAccount: tradingAccount,
            sourceAmount: 100,
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            targetAccount: fiatAccount,
        });
        expect(result).toEqual({
            message: (
                <Localize
                    i18n_default_text='You have reached your daily transfer limit of {{formattedSourceCurrencyLimit}} between your {{sourceAccountName}} and {{targetAccountName}}. The limit will reset at 00:00 GMT.'
                    values={{
                        formattedSourceCurrencyLimit: '1000.00 USD',
                        sourceAccountName: tradingAccount.accountName,
                        targetAccountName: fiatAccount.accountName,
                    }}
                />
            ),
            type: 'error',
        });
    });

    it('returns null if exchange rates are not available', () => {
        const result = cumulativeAccountLimitsMessageFn({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            activeWallet: { currency: 'USD' },
            activeWalletExchangeRates: { rates: {} },
            displayMoney: mockDisplayMoney,
            limits: {
                daily_cumulative_amount_transfers: {
                    standard: {
                        allowed: 1000,
                        available: 800,
                    },
                },
            },
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            sourceAccount: fiatEURAccount,
            sourceAmount: 100,
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            targetAccount: fiatAccount,
        });
        expect(result).toBeNull();
    });

    it('returns null if source account does not match active wallet currency and no exchange rate is available', () => {
        const result = cumulativeAccountLimitsMessageFn({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            activeWallet: { currency: 'USD' },
            activeWalletExchangeRates: { rates: {} },
            displayMoney: mockDisplayMoney,
            limits: {
                daily_cumulative_amount_transfers: {
                    internal: {
                        allowed: 1000,
                        available: 800,
                    },
                },
            },
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            sourceAccount: fiatEURAccount,
            sourceAmount: 100,
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            targetAccount: fiatAccount,
        });
        expect(result).toBeNull();
    });

    it('returns null if target account does not match active wallet currency and no exchange rate is available', () => {
        const result = cumulativeAccountLimitsMessageFn({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            activeWallet: { currency: 'USD' },
            activeWalletExchangeRates: { rates: {} },
            displayMoney: mockDisplayMoney,
            limits: {
                daily_cumulative_amount_transfers: {
                    internal: {
                        allowed: 1000,
                        available: 800,
                    },
                },
            },
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            sourceAccount: fiatAccount,
            sourceAmount: 100,
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            targetAccount: fiatEURAccount,
        });
        expect(result).toBeNull();
    });
});
