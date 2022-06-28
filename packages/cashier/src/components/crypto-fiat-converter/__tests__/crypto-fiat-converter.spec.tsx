import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CryptoFiatConverter from '../crypto-fiat-converter';
import { Formik } from 'formik';
import * as formik from 'formik';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

describe('<CryptoFiatConverter />', () => {
    const mockProps = () => ({
        from_currency: 'BTC',
        hint: 'Transfer limits',
        is_timer_visible: true,
        resetConverter: jest.fn(),
        to_currency: 'USD',
    });

    it('should show the proper hints and labels', () => {
        const props = mockProps();
        render(
            <Formik>
                <CryptoFiatConverter {...props} />
            </Formik>
        );

        expect(screen.getByText('Amount (BTC)')).toBeInTheDocument();
        expect(screen.getByText('Amount (USD)')).toBeInTheDocument();
        expect(screen.getByText('Transfer limits')).toBeInTheDocument();
        expect(screen.getByText('Approximate value')).toBeInTheDocument();
        expect(screen.getByText('60s')).toBeInTheDocument();
    });

    it('should change arrow direction when the focus changes between inputs', () => {
        const props = mockProps();
        render(
            <Formik>
                <CryptoFiatConverter {...props} />
            </Formik>
        );

        const [converter_from_amount_input, converter_to_amount_input] = screen.getAllByRole('textbox');
        converter_from_amount_input.focus();
        expect(screen.getByTestId('dti_arrow_right_bold')).toBeInTheDocument();
        converter_to_amount_input.focus();
        expect(screen.getByTestId('dti_arrow_left_bold')).toBeInTheDocument();
    });

    it('"converter_from_amount" and "converter_to_amount" inputs should show the proper values', () => {
        const props = mockProps();
        render(
            <Formik>
                <CryptoFiatConverter {...props} converter_from_amount={'100'} converter_to_amount={'200'} />
            </Formik>
        );
        const [converter_from_amount_input, converter_to_amount_input] = screen.getAllByRole('textbox');

        expect(converter_from_amount_input).toHaveValue('100');
        expect(converter_to_amount_input).toHaveValue('200');
    });

    it('should trigger onChange callback when the input field changes', () => {
        const props = mockProps();
        const onChangeConverterFromAmount = jest.fn();
        const onChangeConverterToAmount = jest.fn();
        const use_formik_context = jest.spyOn(formik, 'useFormikContext') as any;
        use_formik_context.mockReturnValueOnce({ handleChange: jest.fn() });
        render(
            <Formik>
                <CryptoFiatConverter
                    {...props}
                    converter_from_amount={'100'}
                    converter_to_amount={'200'}
                    onChangeConverterFromAmount={onChangeConverterFromAmount}
                    onChangeConverterToAmount={onChangeConverterToAmount}
                />
            </Formik>
        );
        const [converter_from_amount_input, converter_to_amount_input] = screen.getAllByRole('textbox');
        fireEvent.change(converter_from_amount_input, { target: { value: '2000' } });
        fireEvent.change(converter_to_amount_input, { target: { value: '3000' } });

        expect(onChangeConverterFromAmount).toHaveBeenCalledTimes(1);
        expect(onChangeConverterToAmount).toHaveBeenCalledTimes(1);

        use_formik_context.mockRestore();
    });
});
