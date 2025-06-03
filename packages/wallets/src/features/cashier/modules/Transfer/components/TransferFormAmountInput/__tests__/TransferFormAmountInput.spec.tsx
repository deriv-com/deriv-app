/* eslint-disable camelcase */
import React, { ComponentProps } from 'react';
import * as Formik from 'formik';
import { APIProvider } from '@deriv/api-v2';
import { act, render, screen } from '@testing-library/react';
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

const mockRefetchExchangeRates = jest.fn(() =>
    Promise.resolve({
        data: {
            base_currency: 'USD',
            exchange_rates: {
                rates: RATES,
            },
        },
    })
);

const mockRefetchAccountLimits = jest.fn();

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useGetExchangeRate: jest.fn(({ base_currency }: { base_currency: string }) => ({
        data: {
            base_currency,
            rates: RATES[base_currency as keyof typeof RATES],
        },
    })),
    useTransferBetweenAccounts: jest.fn(() => ({
        data: { accounts: ACCOUNTS },
    })),
}));

jest.mock('usehooks-ts', () => ({
    ...jest.requireActual('usehooks-ts'),
    useCountdown: jest.fn(() => {
        const count = 0;
        const resetCountdown = jest.fn();
        const startCountdown = jest.fn();
        return [count, { resetCountdown, startCountdown }];
    }),
}));

jest.mock('../../../provider', () => ({
    ...jest.requireActual('../../../provider'),
    useTransfer: jest.fn(() => ({
        ...jest.requireActual('../../../provider').useTransfer(),
        refetchAccountLimits: mockRefetchAccountLimits,
        refetchExchangeRates: mockRefetchExchangeRates,
    })),
}));

const renderField = (
    type: ComponentProps<typeof TransferFormAmountInput>['fieldName'],
    currency: string,
    optionalConfig?: Record<string, unknown>
) => {
    const FORM_VALUES: TInitialTransferFormValues = {
        activeAmountFieldName: type,
        fromAccount: undefined,
        fromAmount: '',
        toAccount: undefined,
        toAmount: '',
        [type.replace('Amount', 'Account')]: ACCOUNTS.find(acc => acc.currency === currency),
        ...optionalConfig,
    };

    render(
        <APIProvider>
            <WalletsAuthProvider>
                <TransferProvider accounts={ACCOUNTS}>
                    {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
                    <Formik.Formik initialValues={FORM_VALUES} onSubmit={() => {}}>
                        {({ handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <TransferFormAmountInput fieldName={type} />
                            </form>
                        )}
                    </Formik.Formik>
                </TransferProvider>
            </WalletsAuthProvider>
        </APIProvider>
    );
};

describe('TransferFormAmountInput', () => {
    it('renders 1 input in case of fiat currency and toAccount is not provided', () => {
        renderField('fromAmount', 'USD');

        const fields = screen.getAllByRole('textbox');
        expect(fields).toHaveLength(1);
    });

    it('renders 1 input in case of crypto currency and toAccount is not provided', () => {
        renderField('toAmount', 'BTC');

        const fields = screen.getAllByRole('textbox');
        expect(fields).toHaveLength(1);
    });

    it('has 2 decimal places placeholder in case of USD', () => {
        renderField('fromAmount', 'USD');

        const field = screen.getByPlaceholderText('0.00 USD');
        expect(field).toBeInTheDocument();
    });

    it('has 8 decimal places placeholder in case of BTC', () => {
        renderField('fromAmount', 'BTC');

        const field = screen.getByPlaceholderText('0.00000000 BTC');
        expect(field).toBeInTheDocument();
    });

    it('should paste an parsed value without commas', async () => {
        renderField('fromAmount', 'USD');

        const field = screen.getByRole('textbox');
        const pastedVal = '123,456.78';
        await userEvent.paste(field, pastedVal, {
            clipboardData: {
                getData: (format: string) => (format === 'text' ? pastedVal : ''),
            } as DataTransfer,
        });
        expect(field).toHaveValue('123456.78');
    });

    it('refetches exchangeRatesAndLimits when the countdown is complete', async () => {
        const config = {
            fromAccount: ACCOUNTS[1], // BTC account
            fromAmount: '100',
            toAmount: '0.00000001',
        };

        await act(async () => {
            renderField('toAmount', 'USD', config);
        });
        expect(mockRefetchAccountLimits).toHaveBeenCalled();
        expect(mockRefetchExchangeRates).toHaveBeenCalled();
    });

    it('renders the component when the currency of the fromAccount is not provided', () => {
        const config = {
            fromAmount: '100',
            toAmount: '0.00000001',
        };
        renderField('toAmount', 'USD', config);
        expect(screen.getByText('Estimated amount')).toBeInTheDocument();
    });
});
