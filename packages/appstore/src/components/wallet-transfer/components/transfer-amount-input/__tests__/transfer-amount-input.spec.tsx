import React from 'react';
import * as formik from 'formik';
import { Formik } from 'formik';
import TransferAmountInput from '../transfer-amount-input';
import { render, screen } from '@testing-library/react';

const mockUseFormikContext = jest.spyOn(formik, 'useFormikContext') as jest.Mock;

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    AmountInput: () => <div>AmountInput</div>,
}));
jest.mock('../../../hooks/useWalletTransferValidation', () => () => ({ validator: jest.fn() }));
jest.mock('@deriv/api', () => ({
    useCurrencyConfig: jest.fn(() => ({ getConfig: jest.fn() })),
}));
jest.mock('@deriv/hooks', () => ({
    useExchangeRate: jest.fn(() => ({ getRate: jest.fn() })),
}));

describe('TransferAmountInput', () => {
    let mocked_props: React.ComponentProps<typeof TransferAmountInput>;

    beforeEach(() => {
        mocked_props = {
            field_name: 'from_amount',
            setTimerKey: jest.fn(),
        };

        mockUseFormikContext.mockReturnValue({
            values: {
                from_account: {},
                to_account: {},
            },
            errors: { from_amount: [] },
            setFieldValue: jest.fn(),
        });
    });

    it('should render AmountInput component', () => {
        render(
            <Formik initialValues={{}} onSubmit={() => Promise.resolve()}>
                <TransferAmountInput {...mocked_props} />
            </Formik>
        );

        expect(screen.getByText('AmountInput')).toBeInTheDocument;
    });
});
