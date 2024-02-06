import React from 'react';
import { render, screen } from '@testing-library/react';
import PaymentMethodsHeader from '../PaymentMethodsHeader';

jest.mock('../../public/ic-arrow-left-bold.svg', () => jest.fn(() => 'MockArrowLeftBold'));

describe('PaymentMethodsHeader', () => {
    it('should render the component correctly', () => {
        render(<PaymentMethodsHeader title='Payment Methods' />);
        expect(screen.getByText('Payment Methods')).toBeInTheDocument();
    });
    it('should render the arrow, when ongoback is passed in', () => {
        render(<PaymentMethodsHeader onGoBack={() => undefined} title='Payment Methods' />);
        expect(screen.getByText('MockArrowLeftBold')).toBeInTheDocument();
    });
});
