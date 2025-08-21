import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TurbosTradeDescription from '../turbos-trade-description';
import { getTerm } from 'AppV2/Utils/contract-description-utils';

jest.mock('@lottiefiles/dotlottie-react', () => ({
    DotLottieReact: jest.fn(() => <div>DotLottieReact</div>),
}));

describe('TurbosTradeDescription', () => {
    const mockOnTermClick = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render the component with proper content', () => {
        render(<TurbosTradeDescription onTermClick={mockOnTermClick} />);

        // Check if the main description text is rendered
        expect(
            screen.getByText(/Turbos allow you to predict the direction of the underlying asset's movements/i)
        ).toBeInTheDocument();
    });

    it('should render the video fragments', () => {
        render(<TurbosTradeDescription onTermClick={mockOnTermClick} />);

        // Check if the DotLottieReact component is rendered
        expect(screen.getAllByText('DotLottieReact')).toHaveLength(2); // Two videos: turbos_up and turbos_down
    });

    it('should render all section headings', () => {
        render(<TurbosTradeDescription onTermClick={mockOnTermClick} />);

        // Check if all headings are rendered
        expect(screen.getByText('Up')).toBeInTheDocument();
        expect(screen.getByText('Down')).toBeInTheDocument();
        expect(screen.getByText('Additional Information')).toBeInTheDocument();
    });

    it('should call onTermClick with the correct term when a term button is clicked', () => {
        render(<TurbosTradeDescription onTermClick={mockOnTermClick} />);

        const terms = getTerm();

        // Get all term buttons and test each one
        const payoutButton = screen.getAllByRole('button')[0]; // PAYOUT term
        fireEvent.click(payoutButton);
        expect(mockOnTermClick).toHaveBeenCalledWith(terms.PAYOUT);

        const spotPriceButton = screen.getAllByRole('button')[1]; // SPOT_PRICE term
        fireEvent.click(spotPriceButton);
        expect(mockOnTermClick).toHaveBeenCalledWith(terms.SPOT_PRICE);

        const barrierButton = screen.getAllByRole('button')[2]; // BARRIER term
        fireEvent.click(barrierButton);
        expect(mockOnTermClick).toHaveBeenCalledWith(terms.BARRIER);

        const payoutPerPointButton = screen.getAllByRole('button')[3]; // PAYOUT_PER_POINT term
        fireEvent.click(payoutPerPointButton);
        expect(mockOnTermClick).toHaveBeenCalledWith(terms.PAYOUT_PER_POINT);

        const exitSpotButton = screen.getAllByRole('button')[4]; // EXIT_SPOT term
        fireEvent.click(exitSpotButton);
        expect(mockOnTermClick).toHaveBeenCalledWith(terms.EXIT_SPOT);

        const stakeButton = screen.getAllByRole('button')[5]; // STAKE term
        fireEvent.click(stakeButton);
        expect(mockOnTermClick).toHaveBeenCalledWith(terms.STAKE);

        const expiryButton = screen.getAllByRole('button')[6]; // EXPIRY term
        fireEvent.click(expiryButton);
        expect(mockOnTermClick).toHaveBeenCalledWith(terms.EXPIRY);
    });

    it('should render all expected paragraphs and content sections', () => {
        render(<TurbosTradeDescription onTermClick={mockOnTermClick} />);

        // Check for specific content sections that should be rendered
        expect(
            screen.getByText(/Turbos allow you to predict the direction of the underlying asset's movements/i)
        ).toBeInTheDocument();

        // Check for the video components
        expect(screen.getAllByText('DotLottieReact')).toHaveLength(2);
    });
});
