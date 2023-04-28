import React from 'react';
import { render, screen } from '@testing-library/react';
import WalletIcon from '../icon/icon';

describe('<WalletIcon />', () => {
    it('should render WalletIcon if wallet_icon is passed', () => {
        render(<WalletIcon wallet_icon='IcCurrencyUsd' />);

        expect(screen.getByTestId('dt_wallet_icon_solo')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_account_icon_merged')).not.toBeInTheDocument();
        expect(screen.queryByTestId('dt_wallet_icon_merged')).not.toBeInTheDocument();
    });

    it('should render WalletIcon and AccountIcon if both are passed', () => {
        render(<WalletIcon wallet_icon='IcCurrencyUsd' account_icon='IcMt5Financial' />);

        expect(screen.queryByTestId('dt_wallet_icon_solo')).not.toBeInTheDocument();
        expect(screen.getByTestId('dt_account_icon_merged')).toBeInTheDocument();
        expect(screen.getByTestId('dt_wallet_icon_merged')).toBeInTheDocument();
    });
});
