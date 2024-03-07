import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CashierOnboardingCard from '../CashierOnboardingCard';

describe('CashierOnboardingCard', () => {
    test('should call the onClick callback when clicked', () => {
        const props: React.ComponentProps<typeof CashierOnboardingCard> = {
            description: 'bar',
            onClick: jest.fn(),
            title: 'foo',
        };

        render(<CashierOnboardingCard {...props} />);

        const container = screen.getByTestId('dt_cashier_onboarding_card');

        userEvent.click(container);

        expect(props.onClick).toBeCalledTimes(1);
    });
});
