import React from 'react';
import { Formik } from 'formik';
import { TCurrency } from '../../../../../../../types';
import TransferCryptoFiatAmountConverter from '../TransferCryptoFiatAmountConverter';
import { render, screen } from '@testing-library/react';

jest.mock('../../../../../../../components', () => ({
    ...jest.requireActual('../../../../../../../components'),
    CryptoFiatConverter: jest.fn(({ fromAccount, toAccount }) => (
        <span>{`${JSON.stringify(fromAccount)}${JSON.stringify(toAccount)}`}</span>
    )),
}));

jest.mock('../../../../../provider', () => ({
    ...jest.requireActual('../../../../../provider'),
    useTransfer: jest.fn(() => ({
        exchangeRates: {
            BTC: 0.1,
        },
    })),
}));

const mockFromAccount = {
    balance: 1000,
    currency: 'USD' as TCurrency,
    currencyConfig: { fractional_digits: 2 },
    limits: {
        max: 100,
        min: 1,
    },
};

const mockToAccount = {
    currency: 'BTC' as TCurrency,
    currencyConfig: { fractional_digits: 8 },
};

const wrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <Formik
            initialValues={{
                fromAccount: mockFromAccount,
                toAccount: mockToAccount,
            }}
            onSubmit={jest.fn()}
        >
            {children}
        </Formik>
    );
};

describe('<TransferCryptoFiatAmountConverter />', () => {
    it('should check if the CryptoFiatConverter is receiving the correct values passed as props', () => {
        render(<TransferCryptoFiatAmountConverter />, { wrapper });
        expect(
            screen.getByText(
                `${JSON.stringify(mockFromAccount).replace(
                    '"currencyConfig":{"fractional_digits":2}',
                    '"fractionalDigits":2'
                )}${JSON.stringify(mockToAccount).replace(
                    '"currencyConfig":{"fractional_digits":8}',
                    '"fractionalDigits":8'
                )}`
            )
        ).toBeInTheDocument();
    });
});
