import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import USDTSideNote from '../usdt-side-note';

describe('<USDTSideNote />', () => {
    it('should show proper messages when the crypto type is "eusdt"', () => {
        render(<USDTSideNote type='eusdt' />);

        expect(screen.getByText('About Tether (Ethereum)')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Deriv currently supports withdrawals of Tether eUSDT to Ethereum wallet. To ensure a successful transaction, enter a wallet address compatible with the tokens you wish to withdraw.'
            )
        ).toBeInTheDocument();
        expect(screen.getByText('Learn more')).toBeInTheDocument();
    });

    it('should show proper messages when the client clicks "Learn more" link and the crypto type is "eusdt"', () => {
        const modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);

        render(<USDTSideNote type='eusdt' />);

        const learn_more_link = screen.getByText('Learn more');
        fireEvent.click(learn_more_link);

        expect(screen.getByText('About Tether')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Tether is a blockchain-enabled platform designed to facilitate the use of fiat currencies in a digital manner.'
            )
        ).toBeInTheDocument();
        expect(screen.getByText('Tether on Ethereum (eUSDT)')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Tether on the Ethereum blockchain, as an ERC20 token, is a newer transport layer, which now makes Tether available in Ethereum smart contracts. As a standard ERC20 token, it can also be sent to any Ethereum address.'
            )
        ).toBeInTheDocument();

        document.body.removeChild(modal_root_el);
    });

    it('should show proper messages when the crypto type is "usdt"', () => {
        render(<USDTSideNote type='usdt' />);

        expect(screen.getByText('About Tether (Omni)')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Deriv currently supports withdrawals of Tether USDT to Omni wallet. To ensure a successful transaction, enter a wallet address compatible with the tokens you wish to withdraw.'
            )
        ).toBeInTheDocument();
        expect(screen.getByText('Learn more')).toBeInTheDocument();
    });

    it('should show proper messages when the client clicks "Learn more" link and the crypto type is "usdt"', () => {
        const modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);

        render(<USDTSideNote type='usdt' />);

        const learn_more_link = screen.getByText('Learn more');
        fireEvent.click(learn_more_link);

        expect(screen.getByText('About Tether')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Tether is a blockchain-enabled platform designed to facilitate the use of fiat currencies in a digital manner.'
            )
        ).toBeInTheDocument();
        expect(screen.getByText('Tether on Omni Layer (USDT)')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Tether was originally created to use the bitcoin network as its transport protocol ‒ specifically, the Omni Layer ‒ to allow transactions of tokenised traditional currency.'
            )
        ).toBeInTheDocument();

        document.body.removeChild(modal_root_el);
    });
});
