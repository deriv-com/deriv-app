import React from 'react';
import { render, screen } from '@testing-library/react';
import PaymentAgentMethodsDropdown from '../PaymentAgentMethodsDropdown';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    Dropdown: jest.fn(() => <div>Dropdown</div>),
}));

describe('PaymentAgentMethodsDropdown', () => {
    it('should render PaymentAgentMethodsDropdown', () => {
        render(<PaymentAgentMethodsDropdown />);

        expect(screen.getByText('Dropdown')).toBeInTheDocument();
    });
});
