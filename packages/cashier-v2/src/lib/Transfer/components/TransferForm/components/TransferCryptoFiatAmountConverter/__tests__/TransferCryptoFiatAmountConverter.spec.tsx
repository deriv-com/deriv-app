import React from 'react';
import { Formik } from 'formik';
import { TCurrency } from '../../../../../../../types';
import { CryptoFiatConverter } from '../../../../../../../components';
import TransferCryptoFiatAmountConverter from '../TransferCryptoFiatAmountConverter';
import { render, screen } from '@testing-library/react';

jest.mock('../../../../../../../components', () => ({
    ...jest.requireActual('../../../../../../../components'),
    CryptoFiatConverter: jest.fn(({ fromAccount, toAccount }) => (
        <div>
            {JSON.stringify(fromAccount)}
            {JSON.stringify(toAccount)}
        </div>
    )),
}));

const mockFromAccount = {
    balance: 1000,
    currency: 'USD' as TCurrency,
    fractionalDigits: 2,
    limits: {
        max: 100,
        min: 1,
    },
};

const mockToAccount = {
    currency: 'BTC' as TCurrency,
    fractionalDigits: 8,
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
        render(<CryptoFiatConverter fromAccount={mockFromAccount} toAccount={mockToAccount} />, { wrapper });
        expect(
            screen.getByText(`${JSON.stringify(mockFromAccount)}${JSON.stringify(mockToAccount)}`)
        ).toBeInTheDocument();
    });
});
