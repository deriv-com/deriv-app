import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PaymentAgent from '../PaymentAgent';

jest.mock('../../../components', () => ({
    PageContainer: jest.fn(({ children }) => <div>{children}</div>),
}));

jest.mock('../../../lib', () => ({
    PaymentAgentDepositModule: jest.fn(() => <div>PaymentAgentDepositModule</div>),
}));

jest.mock('../components', () => ({
    PaymentAgentWithdrawalContainer: jest.fn(() => <div>PaymentAgentWithdrawalContainer</div>),
}));

describe('<PaymentAgent />', () => {
    const originalWindowLocation = window.location;

    beforeEach(() => {
        Object.defineProperty(window, 'location', {
            value: new URL('http://localhost/cashier-v2/payment-agent'),
            writable: true,
        });
    });

    afterEach(() => {
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: originalWindowLocation,
        });
    });

    it('should render Deposit tab with proper content by default', () => {
        render(<PaymentAgent />);

        expect(screen.getByText('PaymentAgentDepositModule')).toBeInTheDocument();
    });

    it('should show proper content under the appropriate tab', () => {
        render(<PaymentAgent />);

        const depositTab = screen.getByRole('button', { name: 'Deposit' });
        const withdrawalTab = screen.getByRole('button', { name: 'Withdrawal' });

        userEvent.click(withdrawalTab);

        expect(screen.getByText('PaymentAgentWithdrawalContainer')).toBeInTheDocument();

        userEvent.click(depositTab);

        expect(screen.getByText('PaymentAgentDepositModule')).toBeInTheDocument();
    });

    it('should render Withdrawal tab with proper content by default if there is a `verification` code in url params', () => {
        Object.defineProperty(window, 'location', {
            value: new URL('http://localhost/redirect?verification=1234'),
            writable: true,
        });

        render(<PaymentAgent />);
        expect(screen.getByText('PaymentAgentWithdrawalContainer')).toBeInTheDocument();
    });
});
