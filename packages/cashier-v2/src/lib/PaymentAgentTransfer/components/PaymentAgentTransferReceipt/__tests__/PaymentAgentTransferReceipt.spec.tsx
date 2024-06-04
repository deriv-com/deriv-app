import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PaymentAgentTransferReceipt from '../PaymentAgentTransferReceipt';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

describe('<PaymentAgentTransferReceipt />', () => {
    let mockedProps: React.ComponentProps<typeof PaymentAgentTransferReceipt>;

    beforeEach(() => {
        mockedProps = {
            activeAccount: {
                // @ts-expect-error - since this is a mock, we only need partial properties of the hook
                currency_config: {
                    name: 'US Dollar',
                },
                loginid: 'CR1234567',
            },
            resetPaymentAgentTransfer: jest.fn(),
            transferReceipt: {
                amount: '10',
                clientID: 'CR7654321',
                clientName: 'John Doe',
                currency: 'USD',
            },
        };
    });

    it('should render proper title', () => {
        render(<PaymentAgentTransferReceipt {...mockedProps} />);

        const title = screen.getByText("You've transferred 10.00 USD");

        expect(title).toBeInTheDocument();
    });

    it('should render proper payment agent and client details', () => {
        render(<PaymentAgentTransferReceipt {...mockedProps} />);

        expect(screen.getByText('US Dollar')).toBeInTheDocument();
        expect(screen.getByText('CR1234567')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('CR7654321')).toBeInTheDocument();
    });

    it('should trigger resetPaymentAgentTransfer callback when the user is clicking on Make a new transfer button', () => {
        render(<PaymentAgentTransferReceipt {...mockedProps} />);

        const makeANewTransferButton = screen.getByRole('button', {
            name: 'Make a new transfer',
        });
        userEvent.click(makeANewTransferButton);

        expect(mockedProps.resetPaymentAgentTransfer).toHaveBeenCalledTimes(1);
    });

    it('should redirect the user to /reports/statement route and trigger resetPaymentAgentTransfer callback when the user is clicking on View transactions button', () => {
        const history = createMemoryHistory();

        render(
            <Router history={history}>
                <PaymentAgentTransferReceipt {...mockedProps} />
            </Router>
        );

        const viewTransactionsButton = screen.getByRole('button', {
            name: 'View transactions',
        });
        userEvent.click(viewTransactionsButton);

        expect(history.location.pathname).toBe('/reports/statement');
        expect(mockedProps.resetPaymentAgentTransfer).toHaveBeenCalledTimes(1);
    });
});
