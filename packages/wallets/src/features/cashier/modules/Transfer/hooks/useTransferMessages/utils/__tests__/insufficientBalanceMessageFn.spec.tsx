import React from 'react';
import { Localize } from '@deriv-com/translations';
import insufficientBalanceMessageFn from '../insufficientBalanceMessageFn';

describe('insufficientBalanceMessageFn', () => {
    it('should not return the message when accountName is missing', () => {
        const result = insufficientBalanceMessageFn({
            sourceAccount: {
                balance: '0',
            },
            sourceAmount: 0,
        } as Parameters<typeof insufficientBalanceMessageFn>[0]);

        expect(result).toBe(null);
    });

    it('should not return the message when balance is missing', () => {
        const result = insufficientBalanceMessageFn({
            sourceAccount: {
                accountName: 'USD Wallet',
            },
            sourceAmount: 0,
        } as Parameters<typeof insufficientBalanceMessageFn>[0]);

        expect(result).toBe(null);
    });

    it('should return the message when the balance is 0', () => {
        const result = insufficientBalanceMessageFn({
            sourceAccount: {
                accountName: 'USD Wallet',
                balance: '0',
            },
            sourceAmount: 0,
        } as Parameters<typeof insufficientBalanceMessageFn>[0]);

        expect(result).toEqual({
            message: (
                <Localize
                    i18n_default_text='Your {{sourceAccountName}} has insufficient balance.'
                    values={{ sourceAccountName: 'USD Wallet' }}
                />
            ),
            type: 'error',
        });
    });

    it('should return the message when the balance is less than the amount', () => {
        const result = insufficientBalanceMessageFn({
            sourceAccount: {
                accountName: 'USD Wallet',
                balance: '10',
            },
            sourceAmount: 42,
        } as Parameters<typeof insufficientBalanceMessageFn>[0]);

        expect(result).toEqual({
            message: (
                <Localize
                    i18n_default_text='Your {{sourceAccountName}} has insufficient balance.'
                    values={{ sourceAccountName: 'USD Wallet' }}
                />
            ),
            type: 'error',
        });
    });

    it('should not return the message when the balance is equal to the amount', () => {
        const result = insufficientBalanceMessageFn({
            sourceAccount: {
                accountName: 'USD Wallet',
                balance: '42',
            },
            sourceAmount: 42,
        } as Parameters<typeof insufficientBalanceMessageFn>[0]);

        expect(result).toBe(null);
    });

    it('should not return the message when the balance is more then the amount', () => {
        const result = insufficientBalanceMessageFn({
            sourceAccount: {
                accountName: 'USD Wallet',
                balance: '42',
            },
            sourceAmount: 10,
        } as Parameters<typeof insufficientBalanceMessageFn>[0]);

        expect(result).toBe(null);
    });
});
