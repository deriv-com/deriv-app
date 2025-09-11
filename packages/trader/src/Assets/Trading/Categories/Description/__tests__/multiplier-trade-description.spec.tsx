import React from 'react';
import { render, screen } from '@testing-library/react';
import MultiplierTradeDescription from '../multiplier-trade-description';
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

describe('<MultiplierTradeDescription />', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render the component with proper content', () => {
        render(<MultiplierTradeDescription />);

        // Check if the main description text is rendered
        expect(
            screen.getByText(/Multipliers let you amplify your potential profit or loss by applying a multiplier/i)
        ).toBeInTheDocument();
    });

    it('should render the video fragments', () => {
        render(<MultiplierTradeDescription />);

        // Check if the DotLottieReact components are rendered
        expect(screen.getAllByText('DotLottieReact')).toHaveLength(2); // Two videos: multipliers_up and multipliers_down
    });

    it('should render all section headings', () => {
        render(<MultiplierTradeDescription />);

        // Check if all headings are rendered
        expect(screen.getByText('Up')).toBeInTheDocument();
        expect(screen.getByText('Down')).toBeInTheDocument();
        expect(screen.getByText('Additional Information')).toBeInTheDocument();
    });

    it('should render all definition popovers with correct terms', () => {
        render(<MultiplierTradeDescription />);

        const terms = getTerm();

        // Check if all definition popovers are rendered with correct terms
        expect(screen.getByTestId(`definition-popover-${terms.STOP_OUT}`)).toBeInTheDocument();
        expect(screen.getByTestId(`definition-popover-${terms.TAKE_PROFIT}`)).toBeInTheDocument();
        expect(screen.getByTestId(`definition-popover-${terms.STOP_LOSS}`)).toBeInTheDocument();
        expect(screen.getByTestId(`definition-popover-${terms.DEAL_CANCELLATION}`)).toBeInTheDocument();
        expect(screen.getByTestId(`definition-popover-${terms.SLIPPAGE_RISK}`)).toBeInTheDocument();
    });

    it('should render all expected paragraphs and content sections', () => {
        render(<MultiplierTradeDescription />);

        // Check for specific content sections that should be rendered
        expect(
            screen.getByText(/Multipliers let you amplify your potential profit or loss by applying a multiplier/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/Earn a profit if the asset price rises above the entry price/i)).toBeInTheDocument();
        expect(screen.getByText(/Earn a profit if the asset price falls below the entry price/i)).toBeInTheDocument();
        expect(
            screen.getByText(/A fixed commission is charged when you open a Multipliers trade/i)
        ).toBeInTheDocument();
        expect(
            screen.getByText(/Profit\/loss = \(% of price difference × multiplier × stake\) – commission/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/Your trade closes automatically if the/i)).toBeInTheDocument();
        expect(screen.getByText(/You can manage risk with features like/i)).toBeInTheDocument();
        expect(screen.getByText(/You can close your trade anytime. However, be aware that/i)).toBeInTheDocument();
    });

    it('should pass the correct contract type to definition popovers', () => {
        render(<MultiplierTradeDescription />);

        // Check that all definition popovers have the correct class
        const popovers = screen.getAllByTestId(/definition-popover-/);
        expect(popovers).toHaveLength(5); // Five terms with definition popovers

        popovers.forEach(popover => {
            expect(popover).toHaveClass('mock-popover');
        });
    });
});
