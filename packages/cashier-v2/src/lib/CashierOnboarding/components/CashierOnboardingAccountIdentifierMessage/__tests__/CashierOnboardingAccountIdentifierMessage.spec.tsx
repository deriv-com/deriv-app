import React from 'react';
import { render, screen } from '@testing-library/react';
import CashierOnboardingAccountIdentifierMessage from '../CashierOnboardingAccountIdentifierMessage';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useActiveAccount: jest.fn(() => ({
        data: {
            currency_config: {
                display_code: 'USD',
            },
            loginid: 'CR1234567',
        },
    })),
}));

describe('CashierOnboardingAccountIdentifierMessage', () => {
    test('should show proper identifier message', () => {
        render(<CashierOnboardingAccountIdentifierMessage />);

        expect(screen.getByText('This is your USD account CR1234567.')).toBeInTheDocument();
    });
});
