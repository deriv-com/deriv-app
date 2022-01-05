import React from 'react';
import { render, screen } from '@testing-library/react';
import CryptoFiatConverter from '../crypto-fiat-converter';
import { Formik } from 'formik';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

describe('<CryptoFiatConverter />', () => {
    it('should show the proper hints and labels', () => {
        const resetConverter = jest.fn();
        render(
            <Formik>
                <CryptoFiatConverter
                    hint={'Transfer limits'}
                    to_currency={'USD'}
                    from_currency={'BTC'}
                    resetConverter={resetConverter}
                />
            </Formik>
        );

        expect(screen.getByText('Amount (BTC)')).toBeInTheDocument();
        expect(screen.getByText('Amount (USD)')).toBeInTheDocument();
        expect(screen.getByText('Transfer limits')).toBeInTheDocument();
        expect(screen.getByText('Approximate value')).toBeInTheDocument();
    });

    it('"converter_from_amount" and "converter_to_amount" inputs should show the proper values', () => {
        const resetConverter = jest.fn();
        render(
            <Formik>
                <CryptoFiatConverter
                    converter_from_amount={'100'}
                    converter_to_amount={'200'}
                    hint={'Transfer limits'}
                    to_currency={'USD'}
                    from_currency={'BTC'}
                    resetConverter={resetConverter}
                />
            </Formik>
        );
        const [converter_from_amount_input, converter_to_amount_input] = screen.getAllByRole('textbox');

        expect(converter_from_amount_input.value).toBe('100');
        expect(converter_to_amount_input.value).toBe('200');
    });
});
