import React from 'react';
import { render, screen } from '@testing-library/react';
import USTPopover from '../ust-popover';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Popover: jest.fn(props => <span>{props.message}</span>),
}));

describe('<USTPopover />', () => {
    it('should render USTPopover with UST info', () => {
        render(<USTPopover id='UST' />);

        expect(screen.getByText(/Tether as an Omni token \(USDT\)/i)).toBeInTheDocument();
    });

    it('should render USTPopover with tUSDT info', () => {
        render(<USTPopover id='tUSDT' />);

        expect(screen.getByText(/Tether as a TRC20 token \(tUSDT\)/i)).toBeInTheDocument();
    });

    it('should render USTPopover with default info', () => {
        render(<USTPopover id='test' />);

        expect(screen.getByText(/Tether as an ERC20 token \(eUSDT\)/i)).toBeInTheDocument();
    });
});
