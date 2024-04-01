import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdPaymentDetailsSection from '../AdPaymentDetailsSection';

const mockGetValues = {
    'ad-type': 'buy',
    amount: '100',
    'payment-method': ['alipay'],
    'rate-value': '1.2',
};

const mockFn = jest.fn();
jest.mock('react-hook-form', () => ({
    ...jest.requireActual('react-hook-form'),
    useFormContext: () => ({
        formState: { errors: {}, isValid: true },
        getValues: name => mockGetValues[name],
        setValue: mockFn,
    }),
}));

jest.mock('@deriv/api-v2', () => ({
    p2p: {
        paymentMethods: {
            useGet: () => ({
                data: [
                    {
                        display_name: 'Bank Transfer',
                        fields: {
                            account: {
                                display_name: 'Account Number',
                                required: 1,
                                type: 'text',
                                value: 'Account Number',
                            },
                            bank_name: { display_name: 'Bank Transfer', required: 1, type: 'text', value: 'Bank Name' },
                        },
                        id: 'bank_transfer',
                        is_enabled: 0,
                        method: '',
                        type: 'bank',
                        used_by_adverts: null,
                        used_by_orders: null,
                    },
                ],
            }),
        },
    },
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({ isMobile: false }),
}));

jest.mock('../../AdSummary', () => ({
    AdSummary: () => <div>AdSummary</div>,
}));

jest.mock('../../OrderTimeSelection', () => ({
    OrderTimeSelection: () => <div>OrderTimeSelection</div>,
}));
const mockProps = {
    currency: 'USD',
    getCurrentStep: () => jest.fn(),
    getTotalSteps: () => jest.fn(),
    goToNextStep: jest.fn(),
    goToPreviousStep: jest.fn(),
    localCurrency: 'IDR',
    rateType: 'fixed',
};

describe('AdPaymentDetailsSection', () => {
    it('should render AdPaymentDetailsSection component', () => {
        render(<AdPaymentDetailsSection {...mockProps} />);
        expect(screen.getByText('AdSummary')).toBeInTheDocument();
        expect(screen.getByText('OrderTimeSelection')).toBeInTheDocument();
    });
    it('should handle selection of payment method', () => {
        render(<AdPaymentDetailsSection {...mockProps} />);
        userEvent.click(screen.getByPlaceholderText('Add'));
        userEvent.click(screen.getByText('Bank Transfer'));
        expect(mockFn).toHaveBeenCalledWith('payment-method', ['alipay', 'bank_transfer']);
    });
    it('should handle unselection of payment method', () => {
        mockGetValues['payment-method'] = ['bank_transfer'];
        render(<AdPaymentDetailsSection {...mockProps} />);
        userEvent.click(screen.getByTestId('dt_p2p_v2_payment_delete_icon'));
        expect(mockFn).toHaveBeenCalledWith('payment-method', []);
    });
});
