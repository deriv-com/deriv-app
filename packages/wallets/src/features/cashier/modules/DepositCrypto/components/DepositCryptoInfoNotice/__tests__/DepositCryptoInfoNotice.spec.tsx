import React from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import DepositCryptoInfoNotice from '../DepositCryptoInfoNotice';

jest.mock('@deriv/api-v2', () => ({
    useActiveWalletAccount: jest.fn(),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    SectionMessage: ({
        children,
        title,
        variant,
    }: {
        children: React.ReactNode;
        title: React.ReactNode;
        variant: string;
    }) => (
        <div data-testid='mock-section-message' data-variant={variant}>
            <div data-testid='mock-section-message-title'>{title}</div>
            {children}
        </div>
    ),
}));

describe('DepositCryptoInfoNotice', () => {
    it('renders nothing when currency is not tUSDT', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: { currency: 'USD' },
        });

        const { container } = render(<DepositCryptoInfoNotice />);
        expect(container).toBeEmptyDOMElement();
    });

    it('renders the notice when currency is tUSDT', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: { currency: 'tUSDT' },
        });

        render(<DepositCryptoInfoNotice />);

        const sectionMessage = screen.getByTestId('mock-section-message');
        expect(sectionMessage).toBeInTheDocument();
        expect(sectionMessage).toHaveAttribute('data-variant', 'info');

        const title = screen.getByTestId('mock-section-message-title');
        expect(title).toHaveTextContent('Important:');

        expect(
            screen.getByText('Verify the address on this page before each deposit to avoid losing funds.')
        ).toBeInTheDocument();
    });

    it('handles null activeWallet data', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: null,
        });

        const { container } = render(<DepositCryptoInfoNotice />);
        expect(container).toBeEmptyDOMElement();
    });
});
