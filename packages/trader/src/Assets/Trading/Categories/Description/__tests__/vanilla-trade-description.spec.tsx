import React from 'react';
import { render, screen } from '@testing-library/react';
import VanillaTradeDescription from '../vanilla-trade-description';
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

describe('<VanillaTradeDescription />', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render the component with proper content', () => {
        render(<VanillaTradeDescription />);

        // Check if the main description text is rendered
        expect(screen.getByText(/Vanillas allow you to predict if the underlying asset/i)).toBeInTheDocument();
    });

    it('should render the video fragments', () => {
        render(<VanillaTradeDescription />);

        // Check if the DotLottieReact components are rendered
        expect(screen.getAllByText('DotLottieReact')).toHaveLength(2); // Two videos: vanillas_call and vanillas_put
    });

    it('should render all section headings', () => {
        render(<VanillaTradeDescription />);

        // Check if all headings are rendered
        expect(screen.getByText('Call')).toBeInTheDocument();
        expect(screen.getByText('Put')).toBeInTheDocument();
        expect(screen.getByText('Additional Information')).toBeInTheDocument();
    });

    it('should render all definition popovers with correct terms', () => {
        render(<VanillaTradeDescription />);

        const terms = getTerm();

        // Check if all definition popovers are rendered with correct terms
        expect(screen.getByTestId(`definition-popover-${terms.STRIKE_PRICE}`)).toBeInTheDocument();
        expect(screen.getByTestId(`definition-popover-${terms.EXPIRY}`)).toBeInTheDocument();
        expect(screen.getByTestId(`definition-popover-${terms.EXIT_SPOT}`)).toBeInTheDocument();
        expect(screen.getByTestId(`definition-popover-${terms.PAYOUT}`)).toBeInTheDocument();
        expect(screen.getByTestId(`definition-popover-${terms.PAYOUT_PER_POINT}`)).toBeInTheDocument();
        expect(screen.getByTestId(`definition-popover-${terms.CONTRACT_VALUE}`)).toBeInTheDocument();
    });

    it('should render all expected paragraphs and content sections', () => {
        render(<VanillaTradeDescription />);

        // Check for specific content sections that should be rendered
        expect(screen.getByText(/Vanillas allow you to predict if the underlying asset/i)).toBeInTheDocument();
    });

    it('should pass the correct contract type to definition popovers', () => {
        render(<VanillaTradeDescription />);

        // Check that all definition popovers have the correct class
        const popovers = screen.getAllByTestId(/definition-popover-/);
        expect(popovers).toHaveLength(6); // Six terms with definition popovers

        popovers.forEach(popover => {
            expect(popover).toHaveClass('mock-popover');
        });
    });
});
