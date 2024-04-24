/* eslint-disable camelcase */
import React, { ComponentProps } from 'react';
import { Formik } from 'formik';
import { APIProvider } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WalletsAuthProvider from '../../../../../../../AuthProvider';
import { TransferProvider } from '../../../provider';
import { TAccount, TInitialTransferFormValues } from '../../../types';
import TransferFormAmountInput from '../TransferFormAmountInput';

const RATES = {
    BTC: {
        ETH: 20,
        LTC: 690,
        USD: 69000,
    },
    ETH: {
        BTC: 0.05,
        LTC: 35,
        USD: 3450,
    },
    LTC: {
        BTC: 0.0015,
        ETH: 0.03,
        USD: 100,
    },
    USD: {
        BTC: 0.000015,
        ETH: 0.0003,
        LTC: 0.01,
    },
};

const ACCOUNTS: NonNullable<TAccount>[] = [
    {
        account_category: 'wallet',
        account_type: 'doughflow',
        balance: '1000',
        currency: 'USD',
        currencyConfig: {
            fractional_digits: 2,
        },
    },
    {
        account_category: 'wallet',
        account_type: 'crypto',
        balance: '0.1',
        currency: 'BTC',
        currencyConfig: {
            fractional_digits: 8,
        },
    },
    {
        account_category: 'wallet',
        account_type: 'crypto',
        balance: '1',
        currency: 'ETH',
        currencyConfig: {
            fractional_digits: 8,
        },
    },
    {
        account_category: 'wallet',
        account_type: 'crypto',
        balance: '1',
        currency: 'LTC',
        currencyConfig: {
            fractional_digits: 8,
        },
    },
] as NonNullable<TAccount>[];

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useGetExchangeRate: jest.fn(({ base_currency }: { base_currency: string }) => ({
        data: {
            base_currency,
            rates: RATES[base_currency as keyof typeof RATES],
        },
        refetch: () => ({
            data: {
                base_currency,
                rates: RATES[base_currency as keyof typeof RATES],
            },
        }),
    })),
    useTransferBetweenAccounts: jest.fn(() => ({
        data: { accounts: ACCOUNTS },
    })),
}));

const renderField = (type: ComponentProps<typeof TransferFormAmountInput>['fieldName'], currency: string) => {
    const FORM_VALUES: TInitialTransferFormValues = {
        activeAmountFieldName: type,
        fromAccount: undefined,
        fromAmount: 0,
        toAccount: undefined,
        toAmount: 0,
        [type.replace('Amount', 'Account')]: ACCOUNTS.find(acc => acc.currency === currency),
    };

    render(
        <APIProvider>
            <WalletsAuthProvider>
                <TransferProvider accounts={ACCOUNTS}>
                    {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
                    <Formik initialValues={FORM_VALUES} onSubmit={() => {}}>
                        {({ handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <TransferFormAmountInput fieldName={type} />
                            </form>
                        )}
                    </Formik>
                </TransferProvider>
            </WalletsAuthProvider>
        </APIProvider>
    );
};

const getField = () => screen.getByDisplayValue(/^\d+\.\d+$/u);

describe('TransferFormAmountInput', () => {
    it('renders 2 inputs in case of fiat currency', () => {
        renderField('fromAmount', 'USD');

        const fields = screen.getAllByRole('textbox');
        expect(fields).toHaveLength(2);
    });

    it('renders 2 inputs in case of crypto currency', () => {
        renderField('toAmount', 'BTC');

        const fields = screen.getAllByRole('textbox');
        expect(fields).toHaveLength(2);
    });

    it('has 2 decimal places in case of USD', () => {
        renderField('fromAmount', 'USD');

        const field = getField();
        expect(field).toHaveValue('0.00');
    });

    it('has 8 decimal places in case of BTC', () => {
        renderField('fromAmount', 'BTC');

        const field = getField();
        expect(field).toHaveValue('0.00000000');
    });

    it('has 8 max digits restriction in case of USD', () => {
        renderField('fromAmount', 'USD');

        const field = getField();
        userEvent.type(field, '9999999999999999999999999999');
        expect(field).toHaveValue('999,999.99');
    });

    it('has 9 max digits restriction in case of BTC', () => {
        renderField('fromAmount', 'BTC');

        const field = getField();
        userEvent.type(field, '9999999999999999999999999999');
        expect(field).toHaveValue('9.99999999');
    });

    it('should not react to pasting when exceeding max value in case of USD', () => {
        renderField('fromAmount', 'USD');

        const field = getField();
        const pastedVal = '9999999';
        userEvent.paste(field, pastedVal, {
            clipboardData: {
                getData: (format: string) => (format === 'Text' ? pastedVal : ''),
            } as DataTransfer,
        });
        expect(field).toHaveValue('0.00');
    });

    it('should not react to pasting when exceeding max value in case of BTC', () => {
        renderField('fromAmount', 'BTC');

        const field = getField();
        const pastedVal = '9999999999';
        userEvent.paste(field, pastedVal, {
            clipboardData: {
                getData: (format: string) => (format === 'Text' ? pastedVal : ''),
            } as DataTransfer,
        });
        expect(field).toHaveValue('0.00000000');
    });

    it('should paste an integer value as an integer in case of fiat (USD)', () => {
        renderField('fromAmount', 'USD');

        const field = getField();
        const pastedVal = '123';
        userEvent.paste(field, pastedVal, {
            clipboardData: {
                getData: (format: string) => (format === 'Text' ? pastedVal : ''),
            } as DataTransfer,
        });
        expect(field).toHaveValue('123.00');
    });

    it('should paste an integer value as a fraction in case of crypto (BTC)', () => {
        renderField('fromAmount', 'BTC');

        const field = getField();
        const pastedVal = '123';
        userEvent.paste(field, pastedVal, {
            clipboardData: {
                getData: (format: string) => (format === 'Text' ? pastedVal : ''),
            } as DataTransfer,
        });
        expect(field).toHaveValue('0.00000123');
    });
});
