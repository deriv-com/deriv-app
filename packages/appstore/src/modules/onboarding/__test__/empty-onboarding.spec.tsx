import React from 'react';
import { screen, render } from '@testing-library/react';
import { mockStore, StoreProvider } from '@deriv/stores';
import EmptyOnboarding from '../empty-onboarding';
import { getTradingHubContents } from 'Constants/trading-hub-content';
import Onboarding from '../onboarding';

// Mock TradingPlatformIcon component
jest.mock('Assets/svgs/trading-platform', () => ({
    __esModule: true,
    default: () => <div>DerivLogo</div>,
}));

describe('EmptyOnboarding test cases:', () => {
    it('Should render component', () => {
        const { container } = render(<EmptyOnboarding />);

        expect(container).toBeInTheDocument();
    });

    it('Should render Deriv Logo inside the component', () => {
        render(<EmptyOnboarding />);
        expect(screen.getByText(/DerivLogo/i)).toBeInTheDocument();
    });

    it('Should not render the component when conditions are true', () => {
        const mock = mockStore({
            client: {
                is_logged_in: true,
                is_language_loaded: true,
                is_landing_company_loaded: true,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<Onboarding contents={getTradingHubContents()} />, {
            wrapper,
        });

        expect(container).toBeInTheDocument();
        expect(screen.queryByTestId('deriv_logo')).not.toBeInTheDocument();
    });
});
