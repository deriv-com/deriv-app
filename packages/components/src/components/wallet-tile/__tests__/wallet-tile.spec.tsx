import React from 'react';
import Badge from '../../badge';
import WalletTile from '../wallet-tile';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

jest.mock('../../app-linked-with-wallet-icon/app-linked-with-wallet-icon', () =>
    jest.fn(() => <div>AppLinkedWithWalletIcon</div>)
);
jest.mock('../../wallet-icon/wallet-icon', () => jest.fn(() => <div>WalletIcon</div>));

describe('WalletTile', () => {
    let mocked_props: React.ComponentProps<typeof WalletTile>;

    beforeEach(() => {
        mocked_props = {
            account: {
                balance: '100',
                currency: 'USD',
                icon: 'Icon',
                jurisdiction: <Badge type='bordered' label='SVG' />,
                label: 'Account Label',
                loginid: '12345678',
                type: 'fiat',
                wallet_icon: 'Wallet Icon',
                wallet_name: 'USD Wallet',
            },
            className: 'classname',
            has_hover: false,
            icon_size: 'small',
            is_active: false,
            is_mobile: false,
            is_value: false,
            onClick: jest.fn(),
        };
    });

    it('Should render merged icon (App with Wallet)', () => {
        render(<WalletTile {...mocked_props} />);

        expect(screen.getByText('AppLinkedWithWalletIcon')).toBeInTheDocument();
    });

    it('Should render single wallet icon, if there is no app icon', () => {
        mocked_props.account = { ...mocked_props.account, icon: '' };
        render(<WalletTile {...mocked_props} />);

        expect(screen.getByText('WalletIcon')).toBeInTheDocument();
    });

    it('Should render jurisdiction in mobile view', () => {
        mocked_props.is_value = true;
        mocked_props.is_mobile = true;
        render(<WalletTile {...mocked_props} />);

        expect(screen.getByText('SVG')).toBeInTheDocument();
    });

    it('Should render jurisdiction in desktop view', () => {
        mocked_props.is_value = false;
        render(<WalletTile {...mocked_props} />);

        expect(screen.getByText('SVG')).toBeInTheDocument();
    });

    it('Should render proper account label', () => {
        render(<WalletTile {...mocked_props} />);

        expect(screen.getByText('Account Label')).toBeInTheDocument();
    });

    it('Should render proper account balance', () => {
        render(<WalletTile {...mocked_props} />);

        expect(screen.getByText('Balance: 100 USD')).toBeInTheDocument();
    });

    it('Should trigger onClick callback when the user is clicking on Wallet tile', () => {
        render(<WalletTile {...mocked_props} />);

        const el_wallet_tile = screen.getByTestId('dt_wallet_tile');
        userEvent.click(el_wallet_tile);

        expect(mocked_props.onClick).toHaveBeenCalledTimes(1);
    });
});
