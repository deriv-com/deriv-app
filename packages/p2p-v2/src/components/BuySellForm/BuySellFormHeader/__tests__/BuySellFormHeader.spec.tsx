import React from 'react';
import { render, screen } from '@testing-library/react';
import BuySellFormHeader from '../BuySellFormHeader';

const mockProps = {
    currency: 'USD',
    isBuy: true,
};

describe('BuySellFormHeader', () => {
    it('should render the header as expected', () => {
        render(<BuySellFormHeader {...mockProps} />);
        expect(screen.getByText('Sell USD')).toBeInTheDocument();
    });
});
