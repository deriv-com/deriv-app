import React from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useDevice } from '@deriv-com/ui';
import { THooks } from '../../../hooks/types';
import CryptoFiatConverter from '../CryptoFiatConverter';
import { TCurrency } from '../../../types';
import { Formik } from 'formik';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(),
}));

jest.mock('../../PercentageSelector', () => ({
    ...jest.requireActual('../../PercentageSelector'),
    PercentageSelector: jest.fn(({ amount, balance, onChangePercentage }) => (
        <>
            <button onClick={() => onChangePercentage(25)}>percentageSelector</button>
            <div>{`percentage=${(amount * 100) / balance}`}</div>
        </>
    )),
}));

const mockFromAccount = {
    balance: 1000,
    currency: 'USD' as TCurrency,
    displayBalance: '1000.00 USD',
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

const mockExchangeRates = {
    rates: {
        BTC: '0.5',
    },
} as unknown as THooks.ExchangeRatesSubscribable;

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
            isMobile: false,
        });
    });

    afterEach(cleanup);

    it('should check if the percentage selector field is hidden when the fromAccount and toAccount have same currency', () => {
        render(
            <CryptoFiatConverter fromAccount={mockFromAccount} toAccount={{ ...mockToAccount, currency: 'USD' }} />,
            { wrapper }
        );

        expect(screen.queryByTestId('dt_crypto_fiat_converter_percentage_selector')).not.toBeInTheDocument();
    });

    it('should check if the toAmount field is hidden when the fromAccount and toAccount have same currency', () => {
        render(
            <CryptoFiatConverter fromAccount={mockFromAccount} toAccount={{ ...mockToAccount, currency: 'USD' }} />,
            { wrapper }
        );

        expect(screen.queryByTestId('dt_crypto_fiat_converter_to_amount_field')).not.toBeInTheDocument();
    });

    it('should check if the arrow icon is hidden when the fromAccount and toAccount have same currency', () => {
        render(
            <CryptoFiatConverter fromAccount={mockFromAccount} toAccount={{ ...mockToAccount, currency: 'USD' }} />,
            { wrapper }
        );

        expect(screen.queryByTestId('dt_crypto_fiat_converter_arrow_icon')).not.toBeInTheDocument();
    });

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
        render(
            <CryptoFiatConverter
                exchangeRates={mockExchangeRates}
                fromAccount={mockFromAccount}
                toAccount={mockToAccount}
            />,
            { wrapper }
        );

        const fromAmountField = screen.getByTestId('dt_crypto_fiat_converter_from_amount_field');
        const toAmountField = screen.getByTestId('dt_crypto_fiat_converter_to_amount_field');

        await act(async () => {
            await fireEvent.change(fromAmountField, { target: { value: '1.0' } });
        });

        expect(toAmountField).toHaveValue('0.50000000');
    });

    it('should test for properly converted fromAmount when valid amount is given in toAmount', async () => {
        render(
            <CryptoFiatConverter
                exchangeRates={mockExchangeRates}
                fromAccount={mockFromAccount}
                toAccount={mockToAccount}
            />,
            { wrapper }
        );

        const fromAmountField = screen.getByTestId('dt_crypto_fiat_converter_from_amount_field');
        const toAmountField = screen.getByTestId('dt_crypto_fiat_converter_to_amount_field');

        await act(async () => {
            await fireEvent.change(toAmountField, { target: { value: '1' } });
        });

        expect(fromAmountField).toHaveValue('2.00');
    });

    it('should check if correct percentage is calculated when fromAmount is updated', async () => {
        render(<CryptoFiatConverter fromAccount={mockFromAccount} toAccount={mockToAccount} />, { wrapper });

        const fromAmountField = screen.getByTestId('dt_crypto_fiat_converter_from_amount_field');

        await act(async () => {
            await fireEvent.change(fromAmountField, { target: { value: '10' } });
        });

        expect(screen.getByText('1% of available balance (1000.00 USD)')).toBeInTheDocument();
        expect(screen.getByText('percentage=1')).toBeInTheDocument();
    });

    it('should check if correct percentage is calculated when toAmount is updated', async () => {
        render(<CryptoFiatConverter fromAccount={mockFromAccount} toAccount={mockToAccount} />, { wrapper });

        const fromAmountField = screen.getByTestId('dt_crypto_fiat_converter_from_amount_field');

        await act(async () => {
            await fireEvent.change(fromAmountField, { target: { value: '50.00' } });
        });

        expect(screen.getByText('5% of available balance (1000.00 USD)')).toBeInTheDocument();
        expect(screen.getByText('percentage=5')).toBeInTheDocument();
    });

    it('should check if correct percentage is calculated when toAmount is updated', async () => {
        render(
            <CryptoFiatConverter
                exchangeRates={mockExchangeRates}
                fromAccount={mockFromAccount}
                toAccount={mockToAccount}
            />,
            { wrapper }
        );

        const toAmountField = screen.getByTestId('dt_crypto_fiat_converter_to_amount_field');

        await act(async () => {
            await fireEvent.change(toAmountField, { target: { value: '100.00' } });
        });

        expect(screen.getByText('20% of available balance (1000.00 USD)')).toBeInTheDocument();
        expect(screen.getByText('percentage=20')).toBeInTheDocument();
    });

    it('should update the correct value for fromAmount an toAmount on selecting 25% on the percentage selector', async () => {
        render(
            <CryptoFiatConverter
                exchangeRates={mockExchangeRates}
                fromAccount={mockFromAccount}
                toAccount={mockToAccount}
            />,
            { wrapper }
        );

        const fromAmountField = screen.getByTestId('dt_crypto_fiat_converter_from_amount_field');
        const toAmountField = screen.getByTestId('dt_crypto_fiat_converter_to_amount_field');
        const percentageSelector = screen.getByText('percentageSelector');

        await act(async () => {
            await fireEvent.click(percentageSelector);
        });

        expect(fromAmountField).toHaveValue('250.00');
        expect(toAmountField).toHaveValue('125.00000000');
    });
});
