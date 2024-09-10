import React from 'react';
import { render, screen } from '@testing-library/react';
import { useStore } from '@deriv/stores';
import DepositCryptoInfoNotice from '../deposit-crypto-info-notice';

jest.mock('@deriv/stores', () => ({
    useStore: jest.fn(),
    observer: (component: React.FC) => component,
}));

jest.mock('@deriv-com/ui', () => ({
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
        (useStore as jest.Mock).mockReturnValue({
            client: { currency: 'USD' },
        });

        const { container } = render(<DepositCryptoInfoNotice />);
        expect(container).toBeEmptyDOMElement();
    });

    it('renders the notice when currency is tUSDT', () => {
        (useStore as jest.Mock).mockReturnValue({
            client: { currency: 'tUSDT' },
        });

        render(<DepositCryptoInfoNotice />);

        expect(screen.getByTestId('mock-section-message')).toBeInTheDocument();
        expect(screen.getByTestId('mock-section-message')).toHaveAttribute('data-variant', 'info');
        expect(screen.getByTestId('mock-section-message-title')).toHaveTextContent('Important:');
        expect(
            screen.getByText('Verify the address on this page before each deposit to avoid losing funds.')
        ).toBeInTheDocument();
    });
});
