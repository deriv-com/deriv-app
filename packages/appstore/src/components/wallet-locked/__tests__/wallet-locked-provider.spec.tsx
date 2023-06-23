import React from 'react';
import { render, screen } from '@testing-library/react';
import getMessage from '../wallet-locked-provider';

describe('WalletLockedProvider', () => {
    let mock_props: Parameters<typeof getMessage>[0];
    beforeEach(() => {
        mock_props = {
            is_crypto: false,
            is_system_maintenance: false,
            wallet_name: 'Wallet Name',
        };
    });

    it('should return proper title, description and type if there is a system maintenance and selected wallet is equal to crypto', () => {
        mock_props.is_crypto = true;
        mock_props.is_system_maintenance = true;
        mock_props.wallet_name = 'BTC Wallet';

        const message = getMessage({ ...mock_props });

        const { rerender } = render(<>{message?.title}</>);
        expect(screen.getByText('BTC Wallet deposits are temporarily unavailable')).toBeInTheDocument();

        rerender(<>{message?.description}</>);
        expect(
            screen.getByText(
                'Due to system maintenance, deposits into your BTC Wallet are unavailable at the moment.Please try again later.'
            )
        ).toBeInTheDocument();

        expect(message?.type).toBe('warning');
    });
});
