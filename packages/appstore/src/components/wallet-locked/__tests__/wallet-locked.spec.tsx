import React from 'react';
import { render, screen } from '@testing-library/react';
import WalletLocked from '../wallet-locked';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    LegacyInlineMessage: jest.fn(() => <div>LegacyInlineMessage</div>),
}));

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useIsSystemMaintenance: jest.fn(() => false),
}));

jest.mock('Components/wallet-locked/wallet-locked-provider', () =>
    jest.fn(() => ({
        title: 'Title',
        description: 'Description',
        type: 'Type',
    }))
);

describe('WalletLocked', () => {
    let mock_props: React.ComponentProps<typeof WalletLocked>;
    beforeEach(() => {
        mock_props = {
            is_mobile: false,
            wallet: {
                balance: 100,
                currency: 'USD',
                is_crypto: false,
                is_demo: false,
                name: 'USD Wallet',
                landing_company_shortcode: 'SVG',
                wallet_type: 'real',
            },
        };
    });

    it('should render title, description and alert message', () => {
        render(<WalletLocked {...mock_props} />);

        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Description')).toBeInTheDocument();
        expect(screen.getByText('LegacyInlineMessage')).toBeInTheDocument();
    });
});
