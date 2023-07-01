import React from 'react';
import Badge from '../../badge';
import TransferTile from '../transfer-tile';
import { render, screen } from '@testing-library/react';

jest.mock('../../wallet-tile/wallet-tile', () => jest.fn(() => <div>Wallet Tile</div>));

describe('TransferTile', () => {
    let mocked_props: React.ComponentProps<typeof TransferTile>;

    beforeEach(() => {
        mocked_props = {
            is_mobile: false,
            label: 'Transfer from',
            selected_account: {
                balance: '100',
                currency: 'USD',
                icon: 'IconSrc',
                jurisdiction: <Badge type='bordered' label='SVG' />,
                label: 'Account Label',
                loginid: '12345678',
                type: 'fiat',
                wallet_icon: 'Wallet Icon',
                wallet_name: 'USD Wallet',
            },
            placeholder: 'Placeholder',
        };
    });

    it('Should render proper label', () => {
        render(<TransferTile {...mocked_props} />);

        expect(screen.getByText('Transfer from')).toBeInTheDocument();
    });

    it('Should render wallet tile if selected account exists', () => {
        render(<TransferTile {...mocked_props} />);

        expect(screen.getByText('Wallet Tile')).toBeInTheDocument();
    });

    it("Should render placeholder if selected account doesn't exist", () => {
        mocked_props.selected_account = undefined;
        render(<TransferTile {...mocked_props} />);

        expect(screen.getByText('Placeholder')).toBeInTheDocument();
    });

    it('Should render proper jurisdiction if selected account exists', () => {
        render(<TransferTile {...mocked_props} />);

        expect(screen.getByText('SVG')).toBeInTheDocument();
    });

    it('Should render chevron icon', () => {
        render(<TransferTile {...mocked_props} />);

        expect(screen.getByTestId('dt_chevron_icon')).toBeInTheDocument();
    });
});
