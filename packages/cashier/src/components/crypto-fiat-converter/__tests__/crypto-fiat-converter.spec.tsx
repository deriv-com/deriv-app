import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CryptoFiatConverter from '../crypto-fiat-converter';
import { Formik } from 'formik';
import * as formik from 'formik';
import CashierProviders from '../../../cashier-providers';
import { mockStore } from '@deriv/stores';

describe('<CryptoFiatConverter />', () => {
    let mockRootStore: ReturnType<typeof mockStore>, mockProps: React.ComponentProps<typeof CryptoFiatConverter>;

    beforeEach(() => {
        mockRootStore = mockStore({
            modules: {
                cashier: {
                    crypto_fiat_converter: {
                        converter_from_amount: '100',
                        converter_to_amount: '200',
                    },
                },
            },
        });

        mockProps = {
            arrow_icon_direction: 'right',
            from_currency: 'BTC',
            hint: 'Transfer limits',
            resetConverter: jest.fn(),
            to_currency: 'USD',
            onChangeConverterFromAmount: jest.fn(),
            onChangeConverterToAmount: jest.fn(),
            setArrowIconDirection: jest.fn(),
            validateFromAmount: jest.fn(),
            validateToAmount: jest.fn(),
        };
    });

    const renderCryptoFiatConverter = () => {
        return render(
            <CashierProviders store={mockRootStore}>
                <Formik initialValues={{}} onSubmit={() => Promise.resolve()}>
                    <CryptoFiatConverter {...mockProps} />
                </Formik>
            </CashierProviders>
        );
    };

    it('should show the proper hints and labels', () => {
        renderCryptoFiatConverter();

        expect(screen.getByText('Amount (BTC)')).toBeInTheDocument();
        expect(screen.getByText('Amount (USD)')).toBeInTheDocument();
        expect(screen.getByText('Transfer limits')).toBeInTheDocument();
        expect(screen.getByText('Approximate value')).toBeInTheDocument();
    });

    it('"converter_from_amount" and "converter_to_amount" inputs should show the proper values', () => {
        renderCryptoFiatConverter();

        const [converter_from_amount_input, converter_to_amount_input] = screen.getAllByRole('textbox');

        expect(converter_from_amount_input).toHaveValue('100');
        expect(converter_to_amount_input).toHaveValue('200');
    });

    it('should trigger onChange callback when the input field changes', () => {
        const mockJson = {
            BTC: {
                USD: 2.2,
            },
        };
        window.localStorage.setItem('exchange_rates', JSON.stringify(mockJson));

        const use_formik_context = jest.spyOn(formik, 'useFormikContext') as any;
        use_formik_context.mockReturnValueOnce({ handleChange: jest.fn() });

        renderCryptoFiatConverter();

        const [converter_from_amount_input, converter_to_amount_input] = screen.getAllByRole('textbox');
        fireEvent.change(converter_from_amount_input, { target: { value: '2000' } });
        fireEvent.change(converter_to_amount_input, { target: { value: '3000' } });

        expect(mockProps.onChangeConverterFromAmount).toHaveBeenCalledTimes(1);
        expect(mockProps.onChangeConverterToAmount).toHaveBeenCalledTimes(1);

        use_formik_context.mockRestore();
    });
});
