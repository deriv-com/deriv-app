import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MultipliersTradeDescription from '../multipliers-trade-description';
import { getTerm } from 'AppV2/Utils/contract-description-utils';

jest.mock('@lottiefiles/dotlottie-react', () => ({
    DotLottieReact: jest.fn(() => <div>DotLottieReact</div>),
}));

describe('MultipliersTradeDescription', () => {
    const mockOnTermClick = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render the component with proper content', () => {
        render(<MultipliersTradeDescription onTermClick={mockOnTermClick} />);

        // Check if the main description text is rendered
        expect(
            screen.getByText(/Multipliers let you amplify your potential profit or loss by applying /i)
        ).toBeInTheDocument();
    });

    it('should render the video fragments', () => {
        render(<MultipliersTradeDescription onTermClick={mockOnTermClick} />);

        // Check if the DotLottieReact component is rendered
        expect(screen.getAllByText('DotLottieReact')).toHaveLength(2); // Two videos: multipliers_up and multipliers_down
    });

    it('should render all section headings', () => {
        render(<MultipliersTradeDescription onTermClick={mockOnTermClick} />);

        // Check if all headings are rendered
        expect(screen.getByText('Up')).toBeInTheDocument();
        expect(screen.getByText('Down')).toBeInTheDocument();
        expect(screen.getByText('Additional Information')).toBeInTheDocument();
    });

    it('should call onTermClick with the correct term when a term button is clicked', () => {
        render(<MultipliersTradeDescription onTermClick={mockOnTermClick} />);

        const terms = getTerm();

        // Get all term buttons and test each one
        const stopOutButton = screen.getAllByRole('button')[0]; // STOP_OUT term
        fireEvent.click(stopOutButton);
        expect(mockOnTermClick).toHaveBeenCalledWith(terms.STOP_OUT);

        const takeProfitButton = screen.getAllByRole('button')[1]; // TAKE_PROFIT term
        fireEvent.click(takeProfitButton);
        expect(mockOnTermClick).toHaveBeenCalledWith(terms.TAKE_PROFIT);

        const stopLossButton = screen.getAllByRole('button')[2]; // STOP_LOSS term
        fireEvent.click(stopLossButton);
        expect(mockOnTermClick).toHaveBeenCalledWith(terms.STOP_LOSS);

        const dealCancellationButton = screen.getAllByRole('button')[3]; // DEAL_CANCELLATION term
        fireEvent.click(dealCancellationButton);
        expect(mockOnTermClick).toHaveBeenCalledWith(terms.DEAL_CANCELLATION);

        const slippageRiskButton = screen.getAllByRole('button')[4]; // SLIPPAGE_RISK term
        fireEvent.click(slippageRiskButton);
        expect(mockOnTermClick).toHaveBeenCalledWith(terms.SLIPPAGE_RISK);
    });

    it('should render all expected paragraphs and content sections', () => {
        render(<MultipliersTradeDescription onTermClick={mockOnTermClick} />);

        // Check for specific content sections that should be rendered
        expect(
            screen.getByText(/Multipliers let you amplify your potential profit or loss by applying /i)
        ).toBeInTheDocument();

        // Check for the video components
        expect(screen.getAllByText('DotLottieReact')).toHaveLength(2);
    });
});
