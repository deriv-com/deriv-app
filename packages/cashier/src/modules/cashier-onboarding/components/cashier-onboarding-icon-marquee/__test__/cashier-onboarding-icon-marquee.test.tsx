import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import CashierOnboardingIconMarquee from '../cashier-onboarding-icon-marquee';

describe('CashierOnboardingIconMarquee', () => {
    test('should render cashier onboarding icon marquee', () => {
        const mock = mockStore({});
        const props: React.ComponentProps<typeof CashierOnboardingIconMarquee> = {
            icons: ['foo', 'bar', 'baz'],
        };

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        render(<CashierOnboardingIconMarquee {...props} />, { wrapper });

        const container = screen.getByTestId('dt_cashier_onboarding_icon-marquee');

        expect(container).toBeInTheDocument();
    });
});
