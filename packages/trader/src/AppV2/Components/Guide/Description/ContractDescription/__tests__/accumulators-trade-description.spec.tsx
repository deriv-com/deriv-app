import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getTerm } from 'AppV2/Utils/contract-description-utils';
import AccumulatorsTradeDescription from '../accumulators-trade-description';

jest.mock('@lottiefiles/dotlottie-react', () => ({
    DotLottieReact: jest.fn(() => <div>DotLottieReact</div>),
}));

describe('AccumulatorsTradeDescription', () => {
    it('should render a proper content', () => {
        render(<AccumulatorsTradeDescription onTermClick={jest.fn()} />);

        expect(
            screen.getByText(
                /Your stake will continue to grow as long as the current spot price remains within a specified/i
            )
        ).toBeInTheDocument();
        expect(screen.getByText(/This feature is unavailable for ongoing accumulator contracts./i)).toBeInTheDocument();
    });

    it('should call onTermClick if user clicks on term "growth rate"', () => {
        const onTermClick = jest.fn();
        render(<AccumulatorsTradeDescription onTermClick={onTermClick} />);

        userEvent.click(screen.getByRole('button', { name: getTerm().GROWTH_RATE.toLowerCase() }));

        expect(onTermClick).toHaveBeenCalled();
    });

    it('should call onTermClick if user clicks on term "range"', () => {
        const onTermClick = jest.fn();
        render(<AccumulatorsTradeDescription onTermClick={onTermClick} />);

        userEvent.click(screen.getByRole('button', { name: getTerm().RANGE.toLowerCase() }));

        expect(onTermClick).toHaveBeenCalled();
    });

    it('should call onTermClick if user clicks on term "previous spot price"', () => {
        const onTermClick = jest.fn();
        render(<AccumulatorsTradeDescription onTermClick={onTermClick} />);

        userEvent.click(screen.getByRole('button', { name: getTerm().PREVIOUS_SPOT_PRICE.toLowerCase() }));

        expect(onTermClick).toHaveBeenCalled();
    });

    it('should call onTermClick if user clicks on term "payout"', () => {
        const onTermClick = jest.fn();
        render(<AccumulatorsTradeDescription onTermClick={onTermClick} />);

        userEvent.click(screen.getByRole('button', { name: getTerm().PAYOUT.toLowerCase() }));

        expect(onTermClick).toHaveBeenCalled();
    });

    it('should call onTermClick if user clicks on term "Take profit"', () => {
        const onTermClick = jest.fn();
        render(<AccumulatorsTradeDescription onTermClick={onTermClick} />);

        userEvent.click(screen.getByRole('button', { name: getTerm().TAKE_PROFIT }));

        expect(onTermClick).toHaveBeenCalled();
    });

    it('should call onTermClick if user clicks on term "slippage risk"', () => {
        const onTermClick = jest.fn();
        render(<AccumulatorsTradeDescription onTermClick={onTermClick} />);

        userEvent.click(screen.getByRole('button', { name: getTerm().SLIPPAGE_RISK.toLowerCase() }));

        expect(onTermClick).toHaveBeenCalled();
    });
});
