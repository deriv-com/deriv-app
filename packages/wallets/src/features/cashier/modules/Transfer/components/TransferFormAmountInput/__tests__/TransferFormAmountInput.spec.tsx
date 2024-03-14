/* eslint-disable camelcase */
import React from 'react';
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
        USD: 44000,
    },
    USD: {
        BTC: 0.000023,
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
] as NonNullable<TAccount>[];

const FORM_VALUES: TInitialTransferFormValues = {
    activeAmountFieldName: 'fromAmount',
    fromAccount: ACCOUNTS[0],
    fromAmount: 0,
    toAccount: ACCOUNTS[1],
    toAmount: 0,
};

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

describe('TransferFormAmountInput', () => {
    it('renders two fields', () => {
        render(
            <APIProvider>
                <WalletsAuthProvider>
                    <TransferProvider accounts={ACCOUNTS}>
                        {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
                        <Formik initialValues={FORM_VALUES} onSubmit={() => {}}>
                            {({ handleSubmit }) => (
                                <form onSubmit={handleSubmit}>
                                    <TransferFormAmountInput fieldName='fromAmount' />
                                </form>
                            )}
                        </Formik>
                    </TransferProvider>
                </WalletsAuthProvider>
            </APIProvider>
        );

        const fields = screen.getAllByRole('textbox');
        expect(fields).toHaveLength(2);
    });

    it('has 2 decimal places in case of USD', () => {
        render(
            <APIProvider>
                <WalletsAuthProvider>
                    <TransferProvider accounts={ACCOUNTS}>
                        {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
                        <Formik initialValues={FORM_VALUES} onSubmit={() => {}}>
                            {({ handleSubmit }) => (
                                <form onSubmit={handleSubmit}>
                                    <TransferFormAmountInput fieldName='fromAmount' />
                                </form>
                            )}
                        </Formik>
                    </TransferProvider>
                </WalletsAuthProvider>
            </APIProvider>
        );

        const field = screen.getByDisplayValue(/^\d+\.\d+$/u);
        expect(field).toHaveValue('0.00');
    });

    it('has 8 decimal places in case of BTC', () => {
        render(
            <APIProvider>
                <WalletsAuthProvider>
                    <TransferProvider accounts={ACCOUNTS}>
                        {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
                        <Formik initialValues={FORM_VALUES} onSubmit={() => {}}>
                            {({ handleSubmit }) => (
                                <form onSubmit={handleSubmit}>
                                    <TransferFormAmountInput fieldName='toAmount' />
                                </form>
                            )}
                        </Formik>
                    </TransferProvider>
                </WalletsAuthProvider>
            </APIProvider>
        );

        const field = screen.getByDisplayValue(/^\d+\.\d+$/u);
        expect(field).toHaveValue('0.00000000');
    });

    it('has 8 max digits restriction in case of USD', () => {
        render(
            <APIProvider>
                <WalletsAuthProvider>
                    <TransferProvider accounts={ACCOUNTS}>
                        {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
                        <Formik initialValues={FORM_VALUES} onSubmit={() => {}}>
                            {({ handleSubmit }) => (
                                <form onSubmit={handleSubmit}>
                                    <TransferFormAmountInput fieldName='fromAmount' />
                                </form>
                            )}
                        </Formik>
                    </TransferProvider>
                </WalletsAuthProvider>
            </APIProvider>
        );

        const field = screen.getByDisplayValue(/^\d+\.\d+$/u);
        userEvent.type(field, '9999999999999999999999999999');
        expect(field).toHaveValue('999,999.99');
    });

    it('has 9 max digits restriction in case of BTC', () => {
        render(
            <APIProvider>
                <WalletsAuthProvider>
                    <TransferProvider accounts={ACCOUNTS}>
                        {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
                        <Formik initialValues={FORM_VALUES} onSubmit={() => {}}>
                            {({ handleSubmit }) => (
                                <form onSubmit={handleSubmit}>
                                    <TransferFormAmountInput fieldName='toAmount' />
                                </form>
                            )}
                        </Formik>
                    </TransferProvider>
                </WalletsAuthProvider>
            </APIProvider>
        );

        const field = screen.getByDisplayValue(/^\d+\.\d+$/u);
        userEvent.type(field, '9999999999999999999999999999');
        expect(field).toHaveValue('9.99999999');
    });
});
