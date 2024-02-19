import React from 'react';
import { render, screen } from '@testing-library/react';
import CashierOnboardingIconMarquee from '../CashierOnboardingIconMarquee';

const FakeIcon = (() => <div>FakeIcon</div>) as unknown as React.ComponentProps<
    typeof CashierOnboardingIconMarquee
>['icons'][number]['icon'];

describe('CashierOnboardingIconMarquee', () => {
    test('should render cashier onboarding icon marquee with icons', () => {
        const props: React.ComponentProps<typeof CashierOnboardingIconMarquee> = {
            icons: [
                { icon: FakeIcon, key: '1' },
                { icon: FakeIcon, key: '2' },
                { icon: FakeIcon, key: '3' },
                { icon: FakeIcon, key: '4' },
            ],
        };

        render(<CashierOnboardingIconMarquee {...props} />);

        const container = screen.getByTestId('dt_cashier_onboarding_icon-marquee');

        expect(container).toBeInTheDocument();
        expect(screen.getAllByText('FakeIcon')).toHaveLength(4);
    });
});
