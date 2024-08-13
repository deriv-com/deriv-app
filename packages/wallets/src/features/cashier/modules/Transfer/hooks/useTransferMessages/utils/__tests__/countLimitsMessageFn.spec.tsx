import React from 'react';
import { Localize } from '@deriv-com/translations';
import countLimitMessageFn from '../countLimitsMessageFn';

describe('countLimitMessageFn', () => {
    it('returns null if targetAccount is not provided', () => {
        const result = countLimitMessageFn({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            targetAccount: null,
        });
        expect(result).toBeNull();
    });

    it('handles demo transfer with no available count', () => {
        const result = countLimitMessageFn({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            activeWallet: { is_virtual: true },
            limits: {
                daily_transfers: {
                    virtual: {
                        allowed: 10,
                        available: 0,
                    },
                },
            },
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            sourceAccount: {},
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            targetAccount: {},
        });
        expect(result).toEqual({
            message: (
                <Localize
                    i18n_default_text='You have reached your daily transfer limit of {{allowedCount}} transfers for your virtual funds. The limit will reset at 00:00 GMT.'
                    values={{ allowedCount: 10 }}
                />
            ),
            type: 'error',
        });
    });

    it('handles real account transfer with no available count between wallets', () => {
        const result = countLimitMessageFn({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            activeWallet: { is_virtual: false },
            limits: {
                daily_transfers: {
                    internal: {
                        allowed: 5,
                        available: 0,
                    },
                },
            },
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            sourceAccount: { account_category: 'wallet', accountName: 'Source Wallet' },
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            targetAccount: { account_category: 'wallet', accountName: 'Target Wallet' },
        });
        expect(result).toEqual({
            message: (
                <Localize
                    i18n_default_text='You have reached your daily transfer limit of {{allowedCount}} transfers between your Wallets. The limit will reset at 00:00 GMT.'
                    values={{ allowedCount: 5 }}
                />
            ),
            type: 'error',
        });
    });

    it('handles real account transfer with no available count between non-wallet accounts', () => {
        const result = countLimitMessageFn({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            activeWallet: { is_virtual: false },
            limits: {
                daily_transfers: {
                    internal: {
                        allowed: 5,
                        available: 0,
                    },
                },
            },
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            sourceAccount: { account_category: 'wallet', accountName: 'Source Account' },
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            targetAccount: { account_category: 'trading', accountName: 'Target Account' },
        });
        expect(result).toEqual({
            message: (
                <Localize
                    i18n_default_text='You have reached your daily transfer limit of {{allowedCount}} transfers between your {{sourceAccountName}} and {{targetAccountName}}. The limit will reset at 00:00 GMT.'
                    values={{
                        allowedCount: 5,
                        sourceAccountName: 'Source Account',
                        targetAccountName: 'Target Account',
                    }}
                />
            ),
            type: 'error',
        });
    });

    it('returns null if allowedCount and availableCount are undefined', () => {
        const result = countLimitMessageFn({
            limits: {
                daily_transfers: {
                    standard: {
                        allowed: undefined,
                        available: undefined,
                    },
                },
            },
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            sourceAccount: { account_category: 'wallet', accountName: 'Source Wallet' },
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            targetAccount: { account_category: 'wallet', accountName: 'Target Wallet' },
        });
        expect(result).toBeNull();
    });

    it('returns null if allowedCount and availableCount are defined and availableCount is not 0', () => {
        const result = countLimitMessageFn({
            limits: {
                daily_transfers: {
                    standard: {
                        allowed: 10,
                        available: 5,
                    },
                },
            },
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            sourceAccount: { account_category: 'wallet', accountName: 'Source Wallet' },
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            targetAccount: { account_category: 'wallet', accountName: 'Target Wallet' },
        });
        expect(result).toBeNull();
    });
});
