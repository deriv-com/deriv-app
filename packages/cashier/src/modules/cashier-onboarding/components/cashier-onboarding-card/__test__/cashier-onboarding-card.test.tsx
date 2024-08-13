import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CashierOnboardingCard from '../cashier-onboarding-card';

describe('CashierOnboardingCard', () => {
    test('should call the onClick callback when clicked', () => {
        const mock = mockStore({});
        const props: React.ComponentProps<typeof CashierOnboardingCard> = {
            title: 'foo',
            description: 'bar',
            depositCategory: 'crypto',
            onClick: jest.fn(),
        };

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        render(<CashierOnboardingCard {...props} />, { wrapper });

        const container = screen.getByTestId('dt_cashier_onboarding_card');

        userEvent.click(container);

        expect(props.onClick).toBeCalledTimes(1);
    });
});
