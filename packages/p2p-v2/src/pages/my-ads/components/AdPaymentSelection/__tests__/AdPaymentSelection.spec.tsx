import React from 'react';
import { render, screen } from '@testing-library/react';
import AdPaymentSelection from '../AdPaymentSelection';

const mockProps = {
    isSellAdvert: false,
    onSelectPaymentMethod: jest.fn(),
    selectedPaymentMethods: [],
};

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

jest.mock('../../BuyAdPaymentSelection', () => ({
    BuyAdPaymentSelection: () => <div>BuyAdPaymentSelection</div>,
}));

jest.mock('../../SellAdPaymentSelection', () => ({
    SellAdPaymentSelection: () => <div>SellAdPaymentSelection</div>,
}));

describe('AdPaymentSelection', () => {
    it('should render the ad payment selection component', () => {
        render(<AdPaymentSelection {...mockProps} />);
        expect(screen.getByText('Payment methods')).toBeInTheDocument();
    });
    it('should render the buy ad payment selection component for buy ad', () => {
        render(<AdPaymentSelection {...mockProps} />);
        expect(screen.getByText('BuyAdPaymentSelection')).toBeInTheDocument();
    });
    it('should render the sell ad payment selection component for sell ad', () => {
        render(<AdPaymentSelection {...mockProps} isSellAdvert />);
        expect(screen.getByText('SellAdPaymentSelection')).toBeInTheDocument();
    });
});
