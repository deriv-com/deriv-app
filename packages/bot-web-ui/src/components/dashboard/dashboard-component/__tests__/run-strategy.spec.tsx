import React from 'react';
import { render, screen } from '@testing-library/react';
import RunStrategy from '../run-strategy';

jest.mock('../../../trade-animation/trade-animation', () =>
    jest.fn(props => (
        <div
            data-testid-should-show-overlay={props.should_show_overlay}
            data-testid-info-direction={props.info_direction}
        >
            TradeAnimation
        </div>
    ))
);

describe('RunStrategy', () => {
    beforeEach(() => {
        render(<RunStrategy />);
    });

    it('should render RunStrategy', () => {
        expect(screen.getByText('TradeAnimation')).toBeInTheDocument();
    });

    it('should render the TradeAnimation component with correct props', () => {
        const tradeAnimation = screen.getByText('TradeAnimation');

        expect(tradeAnimation).toHaveAttribute('data-testid-should-show-overlay', 'true');
        expect(tradeAnimation).toHaveAttribute('data-testid-info-direction', 'left');
    });
});
