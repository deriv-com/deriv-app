import React, { PropsWithChildren } from 'react';
import { APIProvider } from '@deriv/api-v2';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import WalletsAuthProvider from '../../../AuthProvider';
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

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({})),
}));

describe('<WalletAddedSuccess />', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });
    });

    it('should render success modal', () => {
        render(<WalletAddedSuccess {...props} />, { wrapper });
        expect(screen.getByText('Make a deposit into your new Wallet.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Deposit' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Maybe later' })).toBeInTheDocument();
    });

    it('should render WalletCard', () => {
        render(<WalletAddedSuccess {...props} />, { wrapper });
        expect(screen.getByTestId('dt_wallets_wallet_card')).toBeInTheDocument();
        expect(screen.getByTestId('dt_wallet_card_details')).toBeInTheDocument();
        expect(screen.getByTestId('dt_wallet_currency_icon')).toBeInTheDocument();
    });

    it('should run function on button click', () => {
        render(<WalletAddedSuccess {...props} />, { wrapper });
        const depositButton = screen.getByRole('button', { name: 'Deposit' });
        const maybeLaterButton = screen.getByRole('button', { name: 'Maybe later' });

        depositButton.click();
        expect(props.onPrimaryButtonClick).toHaveBeenCalled();

        maybeLaterButton.click();
        expect(props.onSecondaryButtonClick).toHaveBeenCalled();
    });

    it('renders modal in mobile', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });

        render(<WalletAddedSuccess {...props} />, { wrapper });
        expect(screen.getByTestId('dt_wallets_wallet_card')).toBeInTheDocument();
        expect(screen.getByTestId('dt_wallet_card_details')).toBeInTheDocument();
        expect(screen.getByTestId('dt_wallet_currency_icon')).toBeInTheDocument();
    });
});
