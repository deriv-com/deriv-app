import React from 'react';
import { useActiveWalletAccount, useSettings, useVerifyEmail } from '@deriv/api-v2';
import { useTranslations } from '@deriv-com/translations';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WalletButton } from '../../../../../components/Base';
import { useModal } from '../../../../../components/ModalProvider';
import useDevice from '../../../../../hooks/useDevice';
import TradingPlatformChangePasswordScreens from '../TradingPlatformChangePasswordScreens';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useActiveWalletAccount: jest.fn(),
    useSettings: jest.fn(),
    useVerifyEmail: jest.fn(),
}));

jest.mock('@deriv-com/translations', () => ({
    ...jest.requireActual('@deriv-com/translations'),
    useTranslations: jest.fn(),
}));

jest.mock('../../../../../components/ModalProvider', () => ({
    ...jest.requireActual('../../../../../components/ModalProvider'),
    useModal: jest.fn(),
}));

jest.mock('../../../../../hooks/useDevice', () => jest.fn(() => ({ isMobile: false })));

jest.mock('../../../../../components', () => ({
    ...jest.requireActual('../../../../../components'),
    SentEmailContent: jest.fn().mockImplementation(() => <div>SentEmailContent</div>),
    WalletsActionScreen: jest.fn(({ description, renderButtons, title }) => (
        <div>
            <h1>{title}</h1>
            <p>{description}</p>
            {renderButtons()}
        </div>
    )),
}));

jest.mock('../../../../../components/Base', () => ({
    ...jest.requireActual('../../../../../components/Base'),
    WalletButton: jest.fn(({ children, onClick }) => <button onClick={onClick}>{children}</button>),
}));

describe('TradingPlatformChangePasswordScreens', () => {
    const mockUseVerifyEmail = jest.fn();

    beforeEach(() => {
        (useVerifyEmail as jest.Mock).mockReturnValue({
            mutate: mockUseVerifyEmail,
        });

        (useModal as jest.Mock).mockReturnValue({
            hide: jest.fn(),
        });

        (useDevice as jest.Mock).mockReturnValue({
            isMobile: false,
        });

        (useSettings as jest.Mock).mockReturnValue({
            data: { email: 'test@mail.com' },
        });

        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: { is_virtual: false },
        });

        (useTranslations as jest.Mock).mockReturnValue({
            localize: jest.fn().mockImplementation((str, { title }) => str.replace('{{title}}', title)),
        });
    });

    it('renders intro screen by default', () => {
        render(<TradingPlatformChangePasswordScreens platform='mt5' />);

        expect(screen.getByText('Deriv MT5 password')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Use this password to log in to your Deriv MT5 accounts on the desktop, web, and mobile apps.'
            )
        ).toBeInTheDocument();
        expect(screen.getByText('Change password')).toBeInTheDocument();
    });

    it('renders confirmation screen when Change password is clicked', () => {
        render(<TradingPlatformChangePasswordScreens platform='mt5' />);

        userEvent.click(screen.getByRole('button', { name: 'Change password' }));

        expect(screen.getByText('Confirm to change your Deriv MT5 password')).toBeInTheDocument();
        expect(
            screen.getByText('This will change the password to all of your Deriv MT5 accounts.')
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    });

    it('renders email verification screen when Confirm is clicked', async () => {
        render(<TradingPlatformChangePasswordScreens platform='mt5' />);

        userEvent.click(screen.getByRole('button', { name: 'Change password' }));
        userEvent.click(screen.getByRole('button', { name: 'Confirm' }));

        expect(screen.getByText('SentEmailContent')).toBeInTheDocument();
    });

    it('calls handleSendEmail when Confirm is clicked and the platform is mt5', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });

        render(<TradingPlatformChangePasswordScreens platform='mt5' />);

        userEvent.click(screen.getByRole('button', { name: 'Change password' }));
        userEvent.click(screen.getByRole('button', { name: 'Confirm' }));

        expect(mockUseVerifyEmail).toHaveBeenCalledWith({
            type: 'trading_platform_mt5_password_reset',
            url_parameters: {
                redirect_to: expect.anything(),
            },
            verify_email: 'test@mail.com',
        });
        expect(WalletButton).toHaveBeenCalledWith(expect.objectContaining({ textSize: 'md' }), {});
    });

    it('calls handleSendEmail when Confirm is clicked and the platform is dxtrade', () => {
        render(<TradingPlatformChangePasswordScreens platform='dxtrade' />);

        userEvent.click(screen.getByRole('button', { name: 'Change password' }));
        userEvent.click(screen.getByRole('button', { name: 'Confirm' }));

        expect(mockUseVerifyEmail).toHaveBeenCalledWith({
            type: 'trading_platform_dxtrade_password_reset',
            url_parameters: {
                redirect_to: expect.anything(),
            },
            verify_email: 'test@mail.com',
        });
    });

    it('hides modal when Cancel is clicked', () => {
        const { hide } = useModal();

        render(<TradingPlatformChangePasswordScreens platform='mt5' />);

        userEvent.click(screen.getByRole('button', { name: 'Change password' }));
        userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

        expect(hide).toHaveBeenCalled();
    });
});
