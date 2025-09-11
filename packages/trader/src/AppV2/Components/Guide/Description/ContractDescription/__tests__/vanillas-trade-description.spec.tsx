import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import VanillasTradeDescription from '../vanillas-trade-description';
import { getTerm } from 'AppV2/Utils/contract-description-utils';

jest.mock('@lottiefiles/dotlottie-react', () => ({
    DotLottieReact: jest.fn(() => <div>DotLottieReact</div>),
}));

describe('VanillasTradeDescription', () => {
    const mockOnTermClick = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render the video fragments', () => {
        render(<VanillasTradeDescription onTermClick={mockOnTermClick} />);

        // Check if the DotLottieReact components are rendered
        expect(screen.getAllByText('DotLottieReact')).toHaveLength(2); // Two videos: vanillas_call and vanillas_put
    });

    it('should render all section headings', () => {
        render(<VanillasTradeDescription onTermClick={mockOnTermClick} />);

        // Check if all headings are rendered
        expect(screen.getByText('Call')).toBeInTheDocument();
        expect(screen.getByText('Put')).toBeInTheDocument();
        expect(screen.getByText('Additional Information')).toBeInTheDocument();
    });

    it('should call onTermClick with the correct term when a term button is clicked', () => {
        render(<VanillasTradeDescription onTermClick={mockOnTermClick} />);

        const terms = getTerm();

        // Get all term buttons and test each one
        const strikePriceButton = screen.getAllByRole('button')[0]; // STRIKE_PRICE term
        fireEvent.click(strikePriceButton);
        expect(mockOnTermClick).toHaveBeenCalledWith(terms.STRIKE_PRICE);

        const expiryButton = screen.getAllByRole('button')[1]; // EXPIRY term
        fireEvent.click(expiryButton);
        expect(mockOnTermClick).toHaveBeenCalledWith(terms.EXPIRY);

        const exitSpotButton = screen.getAllByRole('button')[2]; // EXIT_SPOT term
        fireEvent.click(exitSpotButton);
        expect(mockOnTermClick).toHaveBeenCalledWith(terms.EXIT_SPOT);

        const payoutButton = screen.getAllByRole('button')[3]; // PAYOUT term
        fireEvent.click(payoutButton);
        expect(mockOnTermClick).toHaveBeenCalledWith(terms.PAYOUT);

        const payoutPerPointButton = screen.getAllByRole('button')[4]; // PAYOUT_PER_POINT term
        fireEvent.click(payoutPerPointButton);
        expect(mockOnTermClick).toHaveBeenCalledWith(terms.PAYOUT_PER_POINT);

        const contractValueButton = screen.getAllByRole('button')[5]; // CONTRACT_VALUE term
        fireEvent.click(contractValueButton);
        expect(mockOnTermClick).toHaveBeenCalledWith(terms.CONTRACT_VALUE);
    });

    it('should render all expected paragraphs and content sections', () => {
        render(<VanillasTradeDescription onTermClick={mockOnTermClick} />);

        // Check for specific content sections that should be rendered
        expect(screen.getByText(/Vanillas allow you to predict if the underlying/i)).toBeInTheDocument();

        // Check for the video components
        expect(screen.getAllByText('DotLottieReact')).toHaveLength(2);
    });
});
