import React from 'react';
import { render, screen } from '@testing-library/react';
import AccumulatorTradeDescription from '../accumulator-trade-description';
import { getTerm } from 'AppV2/Utils/contract-description-utils';

// Mock the DotLottieReact component
jest.mock('@lottiefiles/dotlottie-react', () => ({
    DotLottieReact: jest.fn(() => <div>DotLottieReact</div>),
}));

// Mock the DefinitionPopover component
jest.mock('../../definition-popover', () => ({
    __esModule: true,
    default: ({ children, term }: { children: React.ReactNode; term: string }) => (
        <div data-testid={`definition-popover-${term}`} className='mock-popover'>
            {children}
        </div>
    ),
}));

describe('<AccumulatorTradeDescription />', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render the component with proper content', () => {
        render(<AccumulatorTradeDescription />);

        // Check if the main description text is rendered
        expect(screen.getByText(/Accumulators allow you to predict how much an/i)).toBeInTheDocument();
    });

    it('should render the video fragment', () => {
        render(<AccumulatorTradeDescription />);

        // Check if the DotLottieReact component is rendered
        expect(screen.getByText('DotLottieReact')).toBeInTheDocument();
    });

    it('should render all definition popovers with correct terms', () => {
        render(<AccumulatorTradeDescription />);

        const terms = getTerm();

        // Check if all definition popovers are rendered with correct terms
        expect(screen.getByTestId(`definition-popover-${terms.INDEX}`)).toBeInTheDocument();
        expect(screen.getByTestId(`definition-popover-${terms.STAKE}`)).toBeInTheDocument();
        expect(screen.getByTestId(`definition-popover-${terms.GROWTH_RATE}`)).toBeInTheDocument();
        expect(screen.getByTestId(`definition-popover-${terms.PAYOUT}`)).toBeInTheDocument();
        expect(screen.getByTestId(`definition-popover-${terms.BARRIER_RANGE}`)).toBeInTheDocument();
        expect(screen.getByTestId(`definition-popover-${terms.PREVIOUS_SPOT_PRICE}`)).toBeInTheDocument();
        expect(screen.getByTestId(`definition-popover-${terms.TAKE_PROFIT}`)).toBeInTheDocument();
        expect(screen.getByTestId(`definition-popover-${terms.SLIPPAGE_RISK}`)).toBeInTheDocument();
    });

    it('should render all expected paragraphs and content sections', () => {
        render(<AccumulatorTradeDescription />);

        // Check for specific content sections that should be rendered
        expect(screen.getByText(/Accumulators allow you to predict how much an/i)).toBeInTheDocument();
    });

    it('should pass the correct contract type to definition popovers', () => {
        render(<AccumulatorTradeDescription />);

        // Check that all definition popovers have the correct class
        const popovers = screen.getAllByTestId(/definition-popover-/);
        expect(popovers).toHaveLength(8); // Eight terms with definition popovers

        popovers.forEach(popover => {
            expect(popover).toHaveClass('mock-popover');
        });
    });
});
