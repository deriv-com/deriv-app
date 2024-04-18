import React from 'react';
import { render, screen } from '@testing-library/react';
import { TTransferableAccounts, TTransferFormikContext } from '../../../types';
import TransferForm from '../TransferForm';
import { useFormikContext } from 'formik';

const mockAccounts = [
    {
        account_type: 'mt5',
        loginid: 'CR1',
        currencyConfig: {
            fractional_digits: 2,
        },
    },
    {
        account_type: 'ctrader',
        loginid: 'CR2',
        currencyConfig: {
            fractional_digits: 2,
        },
    },
    {
        account_type: 'dxtrade',
        loginid: 'CR3',
        currencyConfig: {
            fractional_digits: 2,
        },
    },
    {
        account_type: 'binary',
        loginid: 'CR4',
        currencyConfig: {
            fractional_digits: 2,
        },
    },
    {
        account_type: 'binary',
        loginid: 'CR5',
        currencyConfig: {
            fractional_digits: 2,
        },
    },
    {
        account_type: 'binary',
        loginid: 'CR6',
        currencyConfig: {
            fractional_digits: 2,
        },
    },
] as TTransferableAccounts;

const mockTransferAccountSelection = jest.fn(() => {
    const { values } = useFormikContext<DeepRequired<TTransferFormikContext>>();
    return (
        <span>
            from-{values.fromAccount.loginid}__to-{values.toAccount.loginid}
        </span>
    );
});

jest.mock('../../../provider', () => ({
    ...jest.requireActual('../../../provider'),
    useTransfer: jest.fn(() => ({
        accounts: mockAccounts,
        activeAccount: mockAccounts[0],
        isLoading: false,
        transferValidationSchema: 'transferValidationSchema',
    })),
}));

jest.mock('../components', () => ({
    ...jest.requireActual('../components'),
    TransferAccountSelection: jest.fn(() => mockTransferAccountSelection()),
    TransferCryptoFiatAmountConverter: jest.fn(() => <div>TransferCryptoFiatAmountConverter</div>),
}));

describe('TransferForm', () => {
    it('should test whether the correct initial from and to accounts are set as Formik initialValues', () => {
        render(<TransferForm />);

        expect(screen.getByText('from-CR1__to-CR2')).toBeInTheDocument();
    });

    it('should test whether the correct initial from and to accounts are set as Formik initialValues', () => {
        render(<TransferForm />);

        expect(screen.getByText('from-CR1__to-CR2')).toBeInTheDocument();
    });
});
