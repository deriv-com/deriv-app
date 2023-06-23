import React from 'react';
import { render, screen } from '@testing-library/react';
import WithdrawRequestVerification from '../withdraw-request-verification';
import { mockStore } from '@deriv/stores';
import CashierProviders from '@deriv/cashier/src/cashier-providers';
import { useRequest } from '@deriv/api';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useRequest: jest.fn(),
}));

// @ts-expect-error ignore this until find a way to make arguments as partial
const mockUseRequest = useRequest as jest.MockedFunction<typeof useRequest<'verify_email'>>;

const mock_store = mockStore({
    client: {
        email: 'john@company.com',
    },
    modules: { cashier: { transaction_history: { onMount: jest.fn() } } },
});

describe('WithdrawRequestVerification', () => {
    test('should render the component with the proper icon', () => {
        // @ts-expect-error ignore this until find a way to make arguments as partial
        mockUseRequest.mockReturnValue({});

        render(<WithdrawRequestVerification />, {
            wrapper: ({ children }) => <CashierProviders store={mock_store}>{children}</CashierProviders>,
        });

        expect(screen.queryByTestId('dt_empty_state_icon_IcWithdrawRequestVerification')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_empty_state_title')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_empty_state_description')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_empty_state_action')).toHaveTextContent('Send email');
    });
});
