import React from 'react';
import { render, screen } from '@testing-library/react';
import PaymentMethodIcon from '../payment-method-icon';
import { StoreProvider, mockStore } from '@deriv-lib/stores';

jest.mock('@deriv-lib/hooks', () => ({
    ...jest.requireActual('@deriv-lib/hooks'),
    useP2PPaymentMethods: jest.fn(() => ({
        data: [
            {
                display_name: 'Skrill',
                icon: 'IcCashierEwallet',
                method: 'skrill',
                type: 'ewallet',
            },
        ],
    })),
}));

describe('<PaymentMethodIcon />', () => {
    it('should render payment method icon with passed props', () => {
        render(<PaymentMethodIcon display_name='Skrill' size={32} />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });
        expect(screen.getByTestId('dt_ic_cashier_ewallet')).toBeInTheDocument();
    });
});
