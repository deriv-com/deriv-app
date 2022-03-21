import { render, screen } from '@testing-library/react';
import WalletCard from '../wallet-card';
import React from 'react';

const setHookState = (is_content_shown: boolean) => jest.fn().mockImplementation(() => [is_content_shown, () => {}]);
React.useState = setHookState(true);
jest.mock('react-inlinesvg', () => jest.fn(() => 'mockedInlineSVG'));

describe('WalletCard Component', () => {
    const props = {
        active: false,
        balance: '',
        currency: undefined,
        dark: false,
        demo: false,
        disabled: false,
        faded: false,
        size: '',
        wallet_name: 'ethereum',
    };

    it('Large WalletCard without balance renders properly', () => {
        render(<WalletCard {...props} size='large' />);

        expect(screen.getByTestId('wallet-card')).toHaveClass('container large');
        expect(screen.getByLabelText('payment_method_logo')).toBeInTheDocument();
        expect(screen.getByText('Ethereum wallet')).toBeInTheDocument();
        expect(screen.queryByText('0.00 ETH')).not.toBeInTheDocument();
    });

    it('Large WalletCard with balance renders properly', () => {
        render(<WalletCard {...props} size='large' balance='0.00' />);

        expect(screen.getByTestId('wallet-card')).toHaveClass('container large');
        expect(screen.getByLabelText('payment_method_logo')).toBeInTheDocument();
        expect(screen.getByText('Ethereum ETH wallet')).toBeInTheDocument();
        expect(screen.getByText('0.00 ETH')).toBeInTheDocument();
        expect(screen.queryByText('[Name] wallet')).not.toBeInTheDocument();
    });

    it('Medium WalletCard without balance renders properly', () => {
        render(<WalletCard {...props} size='medium' />);

        expect(screen.getByTestId('wallet-card')).toHaveClass('container medium');
        expect(screen.getByLabelText('payment_method_logo')).toBeInTheDocument();
        expect(screen.getByText('Ethereum wallet')).toBeInTheDocument();
        expect(screen.queryByText('0.00 ETH')).not.toBeInTheDocument();
    });

    it('Medium WalletCard with balance renders properly', () => {
        render(<WalletCard {...props} size='medium' balance='0.00' />);

        expect(screen.getByTestId('wallet-card')).toHaveClass('container medium');
        expect(screen.getByLabelText('payment_method_logo')).toBeInTheDocument();
        expect(screen.getByText('Ethereum ETH wallet')).toBeInTheDocument();
        expect(screen.getByText('0.00 ETH')).toBeInTheDocument();
        expect(screen.queryByText('Ethereum wallet')).not.toBeInTheDocument();
    });

    it('Small WalletCard renders properly', () => {
        render(<WalletCard {...props} size='small' balance='0.00' />);

        expect(screen.getByTestId('wallet-card')).toHaveClass('container small');
        expect(screen.getByLabelText('payment_method_logo')).toBeInTheDocument();
        expect(screen.queryByText('Ethereum ETH wallet')).not.toBeInTheDocument();
        expect(screen.queryByText('0.00 ETH')).not.toBeInTheDocument();
        expect(screen.queryByText('Ethereum wallet')).not.toBeInTheDocument();
    });

    it('Large Active WalletCard with balance renders properly', () => {
        render(<WalletCard {...props} size='large' balance='0.00' active />);

        expect(screen.getByTestId('wallet-card')).toHaveClass('container large');
        expect(screen.getByLabelText('payment_method_logo')).toBeInTheDocument();
        expect(screen.getByAltText('active_icon')).toBeInTheDocument();
        expect(screen.getByText('Ethereum ETH wallet')).toBeInTheDocument();
        expect(screen.getByText('0.00 ETH')).toBeInTheDocument();
        expect(screen.queryByText('Ethereum wallet')).not.toBeInTheDocument();
    });

    it('A Disabled WalletCard cannot have active state with active icon on it', () => {
        render(<WalletCard {...props} size='large' balance='0.00' active disabled />);

        expect(screen.getByTestId('wallet-card')).toHaveClass('container large');
        expect(screen.getByLabelText('payment_method_logo')).toBeInTheDocument();
        expect(screen.queryByAltText('active_icon')).not.toBeInTheDocument();
        expect(screen.getByText('Ethereum ETH wallet')).toBeInTheDocument();
        expect(screen.getByText('0.00 ETH')).toBeInTheDocument();
        expect(screen.queryByText('Ethereum wallet')).not.toBeInTheDocument();
    });

    it('Large Demo WalletCard renders properly', () => {
        render(<WalletCard {...props} size='large' balance='0.00' demo />);

        expect(screen.getByTestId('wallet-card')).toHaveClass('container large');
        expect(screen.getByLabelText('payment_method_logo')).toBeInTheDocument();
        expect(screen.getByText('Demo ETH wallet')).toBeInTheDocument();
        expect(screen.getByText('0.00 ETH')).toBeInTheDocument();
        expect(screen.queryByText('Demo wallet')).not.toBeInTheDocument();
    });

    it('Large fiat (USD) WalletCard renders properly', () => {
        render(<WalletCard {...props} size='large' balance='0.00' wallet_name='usd' />);

        expect(screen.getByTestId('wallet-card')).toHaveClass('container large');
        expect(screen.getByLabelText('payment_method_logo')).toBeInTheDocument();
        expect(screen.getByText('USD wallet')).toBeInTheDocument();
        expect(screen.getByText('0.00 USD')).toBeInTheDocument();
        expect(screen.queryByText('USD USD wallet')).not.toBeInTheDocument();
    });
});
