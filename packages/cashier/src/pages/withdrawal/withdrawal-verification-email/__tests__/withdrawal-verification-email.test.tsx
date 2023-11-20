import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WithdrawalVerificationEmail from '../withdrawal-verification-email';
import { mockStore } from '@deriv/stores';
import CashierProviders from '../../../../cashier-providers';
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

describe('WithdrawalVerificationEmail', () => {
    test('should render the component', () => {
        // @ts-expect-error ignore this until find a way to make arguments as partial
        mockUseRequest.mockReturnValue({});

        render(<WithdrawalVerificationEmail />, {
            wrapper: ({ children }) => <CashierProviders store={mock_store}>{children}</CashierProviders>,
        });

        expect(screen.queryByTestId('dt_empty_state_title')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_empty_state_description')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_empty_state_action')).toHaveTextContent('Send email');
    });

    test('should show the error component when `error` is provided', () => {
        // @ts-expect-error ignore this until find a way to make arguments as partial
        mockUseRequest.mockReturnValue({ error: { code: 'CODE', message: 'foo' } });

        render(<WithdrawalVerificationEmail />, {
            wrapper: ({ children }) => <CashierProviders store={mock_store}>{children}</CashierProviders>,
        });

        expect(screen.getByText('foo')).toBeInTheDocument();
    });

    test('should show the proper message when email has been sent.', () => {
        // @ts-expect-error ignore this until find a way to make arguments as partial
        mockUseRequest.mockReturnValue({ mutate: jest.fn() });

        render(<WithdrawalVerificationEmail />, {
            wrapper: ({ children }) => <CashierProviders store={mock_store}>{children}</CashierProviders>,
        });

        const send_button = screen.getByText('Send email');
        fireEvent.click(send_button);

        expect(screen.getByText("We've sent you an email.")).toBeInTheDocument();
    });
});
