import React from 'react';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { useDevice } from '@deriv-com/ui';
import CryptoFiatConverter from '../CryptoFiatConverter';
import { TCurrency } from '../../../types';
import { Formik } from 'formik';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(),
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
                fromAmount: '',
                toAmount: '',
            }}
            onSubmit={jest.fn()}
        >
            {children}
        </Formik>
    );
};

describe('CryptoFiatConverter', () => {
    beforeEach(() => {
        (useDevice as jest.Mock).mockReturnValue({
            isMobile: true,
        });
    });

    afterEach(cleanup);

    it('should check if the toAmount field is empty when there is an input error in the fromAmount field', async () => {
        render(<CryptoFiatConverter fromAccount={mockFromAccount} toAccount={mockToAccount} />, { wrapper });

        const fromAmountField = screen.getByTestId('dt_crypto_fiat_converter_from_amount_field');
        const toAmountField = screen.getByTestId('dt_crypto_fiat_converter_to_amount_field');

        await act(async () => {
            await fireEvent.change(fromAmountField, { target: { value: '1.0.' } });
        });

        expect(toAmountField).toHaveValue('');
    });

    it('should check if the fromAmount field is empty when there is an input error in the toAmount field', async () => {
        render(<CryptoFiatConverter fromAccount={mockFromAccount} toAccount={mockToAccount} />, { wrapper });

        const fromAmountField = screen.getByTestId('dt_crypto_fiat_converter_from_amount_field');
        const toAmountField = screen.getByTestId('dt_crypto_fiat_converter_to_amount_field');

        await act(async () => {
            await fireEvent.change(toAmountField, { target: { value: '1.0.' } });
        });

        expect(fromAmountField).toHaveValue('');
    });

    it('should test for properly converted toAmount when valid amount is given in fromAmount', async () => {
        (useDevice as jest.Mock).mockReturnValue({
            isMobile: true,
        });

        render(<CryptoFiatConverter fromAccount={mockFromAccount} toAccount={mockToAccount} />, { wrapper });

        const fromAmountField = screen.getByTestId('dt_crypto_fiat_converter_from_amount_field');
        const toAmountField = screen.getByTestId('dt_crypto_fiat_converter_to_amount_field');

        await act(async () => {
            await fireEvent.change(fromAmountField, { target: { value: '1.0' } });
        });

        expect(toAmountField).toHaveValue('0.50000000');
    });

    it('should test for properly converted fromAmount when valid amount is given in toAmount', async () => {
        (useDevice as jest.Mock).mockReturnValue({
            isMobile: true,
        });

        render(<CryptoFiatConverter fromAccount={mockFromAccount} toAccount={mockToAccount} />, { wrapper });

        const fromAmountField = screen.getByTestId('dt_crypto_fiat_converter_from_amount_field');
        const toAmountField = screen.getByTestId('dt_crypto_fiat_converter_to_amount_field');

        await act(async () => {
            await fireEvent.change(toAmountField, { target: { value: '1' } });
        });

        expect(fromAmountField).toHaveValue('0.50');
    });
});
