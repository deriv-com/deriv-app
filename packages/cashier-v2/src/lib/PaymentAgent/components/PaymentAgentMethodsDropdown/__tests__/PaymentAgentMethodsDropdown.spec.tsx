import React from 'react';
import { render, screen } from '@testing-library/react';
import PaymentAgentMethodsDropdown from '../PaymentAgentMethodsDropdown';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    Dropdown: jest.fn(() => <div>Dropdown</div>),
}));

jest.mock('../../../provider', () => ({
    usePaymentAgentContext: jest.fn(() => ({
        onSelectPaymentMethodHandler: jest.fn(),
        selectedPaymentMethod: 'Card',
        supportedPaymentMethods: ['Card', 'Crypto'],
    })),
}));

describe('PaymentAgentMethodsDropdown', () => {
    it('should render PaymentAgentMethodsDropdown', () => {
        render(<PaymentAgentMethodsDropdown />);

        expect(screen.getByText('Dropdown')).toBeInTheDocument();
    });
});
