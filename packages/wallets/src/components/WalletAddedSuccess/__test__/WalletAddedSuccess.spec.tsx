import React, { PropsWithChildren } from 'react';
import { APIProvider } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import WalletsAuthProvider from '../../../AuthProvider';
import useDevice from '../../../hooks/useDevice';
import { ModalProvider } from '../../ModalProvider';
import WalletAddedSuccess from '../WalletAddedSuccess';

const props = {
    currency: 'USD',
    displayBalance: '10,000.00 USD',
    landingCompany: 'svg',
    onPrimaryButtonClick: jest.fn(),
    onSecondaryButtonClick: jest.fn(),
};

const wrapper = ({ children }: PropsWithChildren) => (
    <APIProvider>
        <WalletsAuthProvider>
            <ModalProvider>{children}</ModalProvider>
        </WalletsAuthProvider>
    </APIProvider>
);

jest.mock('../../../hooks/useDevice', () => jest.fn());

describe('<WalletAddedSuccess />', () => {
    it('should render success modal', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: false });

        render(<WalletAddedSuccess {...props} />, { wrapper });
        expect(screen.getByText('Make a deposit into your new Wallet.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Deposit' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Maybe later' })).toBeInTheDocument();
    });

    it('should render WalletCard', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: false });

        render(<WalletAddedSuccess {...props} />, { wrapper });
        expect(screen.getByTestId('dt_wallets_wallet_card')).toBeInTheDocument();
        expect(screen.getByTestId('dt_wallet_card_details')).toBeInTheDocument();
        expect(screen.getByTestId('dt_wallet_currency_icon')).toBeInTheDocument();
    });

    it('should run function on button click', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: false });

        render(<WalletAddedSuccess {...props} />, { wrapper });
        const depositButton = screen.getByRole('button', { name: 'Deposit' });
        const maybeLaterButton = screen.getByRole('button', { name: 'Maybe later' });

        depositButton.click();
        expect(props.onPrimaryButtonClick).toHaveBeenCalled();

        maybeLaterButton.click();
        expect(props.onSecondaryButtonClick).toHaveBeenCalled();
    });

    it('should render mobile modal', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });

        render(<WalletAddedSuccess {...props} />, { wrapper });
        expect(screen.getByTestId('dt_wallets_wallet_card')).toBeInTheDocument();
        expect(screen.getByTestId('dt_wallet_card_details')).toBeInTheDocument();
        expect(screen.getByTestId('dt_wallet_currency_icon')).toBeInTheDocument();
    });
});
