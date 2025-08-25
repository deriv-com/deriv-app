import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AccumulatorsTradeDescription from '../accumulators-trade-description';
import { getTerm, getContractDescription } from 'AppV2/Utils/contract-description-utils';

jest.mock('@lottiefiles/dotlottie-react', () => ({
    DotLottieReact: jest.fn(() => <div>DotLottieReact</div>),
}));

describe('AccumulatorsTradeDescription', () => {
    const mockOnTermClick = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render the component with proper content', () => {
        render(<AccumulatorsTradeDescription onTermClick={mockOnTermClick} />);

        // Check if the main description text is rendered
        expect(screen.getByText(/Accumulators allow you to predict how much an/i)).toBeInTheDocument();
    });

    it('should render the video fragment', () => {
        render(<AccumulatorsTradeDescription onTermClick={mockOnTermClick} />);

        // Check if the DotLottieReact component is rendered
        expect(screen.getByText('DotLottieReact')).toBeInTheDocument();
    });

    it('should call onTermClick with the correct term when a term button is clicked', () => {
        render(<AccumulatorsTradeDescription onTermClick={mockOnTermClick} />);

        const terms = getTerm();

        // Get all term buttons and test each one
        const indexButton = screen.getAllByRole('button')[0]; // INDEX term
        fireEvent.click(indexButton);
        expect(mockOnTermClick).toHaveBeenCalledWith(terms.INDEX);

        const stakeButton = screen.getAllByRole('button')[1]; // STAKE term
        fireEvent.click(stakeButton);
        expect(mockOnTermClick).toHaveBeenCalledWith(terms.STAKE);

        const growthRateButton = screen.getAllByRole('button')[2]; // GROWTH_RATE term
        fireEvent.click(growthRateButton);
        expect(mockOnTermClick).toHaveBeenCalledWith(terms.GROWTH_RATE);

        const payoutButton = screen.getAllByRole('button')[3]; // PAYOUT term
        fireEvent.click(payoutButton);
        expect(mockOnTermClick).toHaveBeenCalledWith(terms.PAYOUT);

        const barrierRangeButton = screen.getAllByRole('button')[4]; // BARRIER_RANGE term
        fireEvent.click(barrierRangeButton);
        expect(mockOnTermClick).toHaveBeenCalledWith(terms.BARRIER_RANGE);

        const previousSpotPriceButton = screen.getAllByRole('button')[5]; // PREVIOUS_SPOT_PRICE term
        fireEvent.click(previousSpotPriceButton);
        expect(mockOnTermClick).toHaveBeenCalledWith(terms.PREVIOUS_SPOT_PRICE);

        const takeProfitButton = screen.getAllByRole('button')[6]; // TAKE_PROFIT term
        fireEvent.click(takeProfitButton);
        expect(mockOnTermClick).toHaveBeenCalledWith(terms.TAKE_PROFIT);

        const slippageRiskButton = screen.getAllByRole('button')[7]; // SLIPPAGE_RISK term
        fireEvent.click(slippageRiskButton);
        expect(mockOnTermClick).toHaveBeenCalledWith(terms.SLIPPAGE_RISK);
    });

    it('should render all expected paragraphs and content sections', () => {
        render(<AccumulatorsTradeDescription onTermClick={mockOnTermClick} />);

        // Check for specific content sections that should be rendered
        expect(screen.getByText(/Accumulators allow you to predict how much an/i)).toBeInTheDocument();

        // Check for the video component
        expect(screen.getByText('DotLottieReact')).toBeInTheDocument();
    });
});
