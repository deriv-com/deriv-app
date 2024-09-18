import React, { ComponentProps } from 'react';
import { useJurisdictionStatus, useTradingPlatformStatus } from '@deriv/api-v2';
import { Localize } from '@deriv-com/translations';
import { InlineMessage } from '@deriv-com/ui';
import { fireEvent, render, screen } from '@testing-library/react';
import { useModal } from '../../../../../../components/ModalProvider';
import { THooks } from '../../../../../../types';
import { PlatformStatusBadge } from '../../../../components';
import { MT5TradeModal, TradingPlatformStatusModal, VerificationFailedModal } from '../../../../modals';
import AddedMT5AccountsList from '../AddedMT5AccountsList';

const mockZeroSpreadDetails = {
    description: 'Zero spread CFDs on financial and derived instruments',
    icon: <span>AccountsDmt5ZrsIcon </span>,
    title: 'Zero Spread',
};
const mockSwapFreeDetails = {
    description: 'Swap-free CFDs on selected financial and derived instruments',
    icon: <span>AccountsDmt5SwfIcon </span>,
    title: 'Swap-Free',
};

jest.mock('../../../../constants', () => ({
    CFD_PLATFORMS: {
        CFDS: 'CFDs',
        CTRADER: 'ctrader',
        DXTRADE: 'dxtrade',
        MT5: 'mt5',
    } as const,
    getMarketTypeDetails: jest.fn(
        (product?: THooks.AvailableMT5Accounts['product']) =>
            ({
                all: product === 'zero_spread' ? mockZeroSpreadDetails : mockSwapFreeDetails,
                financial: {
                    description: 'CFDs on financial instruments',
                    icon: <span>AccountsDmt5FinancialIcon</span>,
                    title: 'Financial',
                },
                synthetic: {
                    description: 'CFDs on derived and financial instruments',
                    icon: <span>AccountsDmt5StandardIcon</span>,
                    title: 'Standard',
                },
            } as const)
    ),
    MT5_ACCOUNT_STATUS: {
        FAILED: 'failed',
        MIGRATED_WITH_POSITION: 'migrated_with_position',
        MIGRATED_WITHOUT_POSITION: 'migrated_without_position',
        NEEDS_VERIFICATION: 'needs_verification',
        PENDING: 'pending',
        POA_PENDING: 'poa_pending',
        POA_VERIFIED: 'poa_verified',
        UNAVAILABLE: 'unavailable',
        UNDER_MAINTENANCE: 'under_maintenance',
    } as const,
    PlatformDetails: {
        ctrader: {
            icon: jest.fn(() => <span>AccountsDerivCtraderIcon</span>),
            link: 'https://onelink.to/5jgj8z',
            platform: 'ctrader',
            title: 'Deriv cTrader',
        },
        dxtrade: {
            icon: jest.fn(() => <span>AccountsDerivXIcon</span>),
            link: 'https://onelink.to/grmtyx',
            platform: 'dxtrade',
            title: 'Deriv X',
        },
        mt5: {
            icon: jest.fn(() => <span>AccountsDmt5StandardIcon</span>),
            link: 'https://onelink.to/xf26jx',
            platform: 'mt5',
            title: 'Deriv MT5',
        },
        mt5Investor: {
            icon: jest.fn(() => <span>AccountsDmt5StandardIcon</span>),
            link: 'https://onelink.to/xf26jx',
            platform: 'mt5',
            title: 'Deriv MT5 investor',
        },
    } as const,
    TRADING_PLATFORM_STATUS: {
        ACTIVE: 'active',
        DISABLED: 'disabled',
        MAINTENANCE: 'maintenance',
        UNAVAILABLE: 'unavailable',
    } as const,
}));

jest.mock('@deriv/api-v2', () => ({
    useJurisdictionStatus: jest.fn(),
    useTradingPlatformStatus: jest.fn(),
}));

jest.mock('../../../../../../components/ModalProvider', () => ({
    useModal: jest.fn(() => ({
        hide: jest.fn(),
        show: jest.fn(),
    })),
}));

jest.mock('@deriv-com/translations', () => ({
    // eslint-disable-next-line camelcase
    Localize: ({ components, i18n_default_text, values }: ComponentProps<typeof Localize>) => {
        // eslint-disable-next-line camelcase
        let text = i18n_default_text;

        if (values) {
            Object.entries(values).forEach(([key, value]) => {
                text = text.replace(new RegExp(`{{${key}}}`, 'g'), value);
            });
        }

        if (components) {
            components.forEach((component, index) => {
                text = text.replace(new RegExp(`<${index}>`, 'g'), `<${component.type}>`);
                text = text.replace(new RegExp(`</${index}>`, 'g'), `</${component.type}>`);
            });
        }
        return <div dangerouslySetInnerHTML={{ __html: text }} />;
    },
    localize: jest.fn((text: string) => text),
    useTranslations: jest.fn(() => ({
        localize: jest.fn((text: string) => text),
    })),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    InlineMessage: ({ children, className }: ComponentProps<typeof InlineMessage>) => (
        <div className={className} data-testid='dt_inline_message'>
            {children}
        </div>
    ),
}));

jest.mock('../../../../components/PlatformStatusBadge', () => ({
    PlatformStatusBadge: ({ badgeSize, className, mt5Account }: ComponentProps<typeof PlatformStatusBadge>) => (
        <div className={className} data-testid='dt_platform_status_badge'>
            {badgeSize} - {mt5Account?.platform}
        </div>
    ),
}));

jest.mock('../../../../modals', () => ({
    MT5TradeModal: jest.fn(() => <div data-testid='dt_wallets_mt5_trade_modal'>MT5 Trade Modal</div>),
    TradingPlatformStatusModal: jest.fn(({ isServerMaintenance }) => (
        <div>{`Trading Platform Status Modal - ${isServerMaintenance}`}</div>
    )),
    VerificationFailedModal: jest.fn(({ selectedJurisdiction }) => (
        <div>{`Verification Failed Modal - ${selectedJurisdiction}`}</div>
    )),
}));

jest.mock('../../../../../../components', () => ({
    WalletDisabledAccountModal: jest.fn(({ isVisible, onClose }) =>
        isVisible ? (
            <div data-testid='dt_wallet_disabled_account_modal'>
                <span>Wallet Disabled Account Modal</span>
                <button onClick={onClose}>Close</button>
            </div>
        ) : null
    ),
    WalletStatusBadge: ({ status }: { status: string }) => <div data-testid='dt_wallet_status_badge'>{status}</div>,
}));

describe('AddedMT5AccountsList', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (useJurisdictionStatus as jest.Mock).mockReturnValue({
            getVerificationStatus: jest.fn(() => ({
                is_failed: false,
                is_pending: false,
            })),
        });

        (useTradingPlatformStatus as jest.Mock).mockReturnValue({
            getPlatformStatus: jest.fn(() => 'active'),
        });

        (useModal as jest.Mock).mockReturnValue({
            hide: jest.fn(),
            show: jest.fn(),
        });
    });

    const defaultAccount = {
        display_balance: '$10,000',
        display_login: 'MT0001',
        landing_company_short: 'svg',
        market_type: 'all',
        platform: 'mt5',
        rights: { enabled: true },
        status: 'active',
    };

    const mockShow = jest.fn();

    const renderComponent = (accountProps = {}) => {
        const account = { ...defaultAccount, ...accountProps };
        (useModal as jest.Mock).mockReturnValue({
            hide: jest.fn(),
            show: mockShow,
        });

        // @ts-expect-error Not all properties are mocked
        render(<AddedMT5AccountsList account={account} />);
    };

    it('renders account details correctly', () => {
        renderComponent();

        const card = screen.getByTestId('dt_wallets_trading_account_card');
        expect(card).toBeInTheDocument();

        const title = screen.getByText('Swap-Free');
        expect(title).toBeInTheDocument();

        const balance = screen.getByText('$10,000');
        expect(balance).toBeInTheDocument();

        const login = screen.getByText('MT0001');
        expect(login).toBeInTheDocument();
    });

    it('shows WalletStatusBadge when account is disabled', () => {
        renderComponent({ rights: { enabled: false } });

        expect(screen.getByTestId('dt_wallet_status_badge')).toHaveTextContent('disabled');
    });

    it('opens WalletDisabledAccountModal when disabled account card is clicked', () => {
        renderComponent({ rights: { enabled: false } });

        const card = screen.getByTestId('dt_wallets_trading_account_card');
        fireEvent.click(card);

        expect(screen.getByTestId('dt_wallet_disabled_account_modal')).toBeInTheDocument();

        const closeButton = screen.getByText('Close');
        fireEvent.click(closeButton);
        expect(screen.queryByTestId('dt_wallet_disabled_account_modal')).not.toBeInTheDocument();
    });

    it('shows InlineMessage with warning when jurisdiction is pending', () => {
        (useJurisdictionStatus as jest.Mock).mockReturnValue({
            getVerificationStatus: jest.fn(() => ({
                is_failed: false,
                is_pending: true,
            })),
        });

        renderComponent();

        const inlineMessage = screen.getByTestId('dt_inline_message');
        expect(inlineMessage).toHaveClass('wallets-added-mt5__badge--warning');

        expect(screen.getByText('Pending verification')).toBeInTheDocument();
    });

    it('disables the card when jurisdiction is pending', () => {
        (useJurisdictionStatus as jest.Mock).mockReturnValue({
            getVerificationStatus: jest.fn().mockReturnValue({
                is_failed: false,
                is_pending: true,
            }),
        });

        renderComponent();

        const card = screen.getByTestId('dt_wallets_trading_account_card');
        expect(card).toHaveAttribute('aria-disabled', 'true');

        fireEvent.click(card);
        expect(mockShow).not.toHaveBeenCalled();
    });

    it('shows InlineMessage with error when jurisdiction has failed', () => {
        (useJurisdictionStatus as jest.Mock).mockReturnValue({
            getVerificationStatus: jest.fn().mockReturnValue({
                is_failed: true,
                is_pending: false,
            }),
        });

        renderComponent();

        const inlineMessage = screen.getByTestId('dt_inline_message');
        expect(inlineMessage).toHaveClass('wallets-added-mt5__badge--error');

        expect(screen.getByText('Verification failed')).toBeInTheDocument();
        expect(screen.getByText('Why?')).toBeInTheDocument();
    });

    it('opens VerificationFailedModal when "Why?" link is clicked', () => {
        (useJurisdictionStatus as jest.Mock).mockReturnValue({
            getVerificationStatus: jest.fn().mockReturnValue({
                is_failed: true,
                is_pending: false,
            }),
        });

        renderComponent();

        const whyLink = screen.getByText('Why?');

        whyLink.addEventListener('click', () => mockShow);

        fireEvent.click(whyLink);

        expect(mockShow).toHaveBeenCalledWith(
            <VerificationFailedModal selectedJurisdiction='svg' />,
            expect.objectContaining({
                defaultRootId: 'wallets_modal_root',
            })
        );
    });

    it('shows PlatformStatusBadge when platform is under maintenance', () => {
        (useTradingPlatformStatus as jest.Mock).mockReturnValue({
            getPlatformStatus: jest.fn().mockReturnValue('maintenance'),
        });

        (useJurisdictionStatus as jest.Mock).mockReturnValue({
            getVerificationStatus: jest.fn().mockReturnValue({
                is_failed: false,
                is_pending: false,
            }),
        });

        renderComponent();

        expect(screen.getByTestId('dt_platform_status_badge')).toBeInTheDocument();
    });

    it('opens TradingPlatformStatusModal when platform is under maintenance and card is clicked', () => {
        (useTradingPlatformStatus as jest.Mock).mockReturnValue({
            getPlatformStatus: jest.fn().mockReturnValue('maintenance'),
        });

        (useJurisdictionStatus as jest.Mock).mockReturnValue({
            getVerificationStatus: jest.fn().mockReturnValue({
                is_failed: false,
                is_pending: false,
            }),
        });

        renderComponent();

        const card = screen.getByTestId('dt_wallets_trading_account_card');
        fireEvent.click(card);

        expect(mockShow).toHaveBeenCalledWith(
            <TradingPlatformStatusModal isServerMaintenance={true} />,
            expect.objectContaining({
                defaultRootId: 'wallets_modal_root',
            })
        );
    });

    it('opens MT5TradeModal when platform is active and jurisdiction is not failed or pending', () => {
        (useTradingPlatformStatus as jest.Mock).mockReturnValue({
            getPlatformStatus: jest.fn().mockReturnValue('active'),
        });

        (useJurisdictionStatus as jest.Mock).mockReturnValue({
            getVerificationStatus: jest.fn().mockReturnValue({
                is_failed: false,
                is_pending: false,
            }),
        });

        renderComponent();

        const card = screen.getByTestId('dt_wallets_trading_account_card');
        fireEvent.click(card);
        expect(mockShow).toHaveBeenCalledWith(expect.any(Object));
        expect(mockShow).toHaveBeenCalledWith(
            // @ts-expect-error Not all properties are mocked
            <MT5TradeModal marketType='all' mt5Account={defaultAccount} platform='mt5' />
        );
    });

    it('does not show balance when jurisdiction is failed', () => {
        (useJurisdictionStatus as jest.Mock).mockReturnValueOnce({
            getVerificationStatus: jest.fn().mockReturnValue({
                is_failed: true,
                is_pending: false,
            }),
        });

        renderComponent();

        expect(screen.queryByText('$10,000')).not.toBeInTheDocument();
    });

    it('does not show balance when jurisdiction is pending', () => {
        (useJurisdictionStatus as jest.Mock).mockReturnValueOnce({
            getVerificationStatus: jest.fn().mockReturnValue({
                is_failed: false,
                is_pending: true,
            }),
        });

        renderComponent();

        expect(screen.queryByText('$10,000')).not.toBeInTheDocument();
    });

    it('does not show balance when the account is disabled', () => {
        (useJurisdictionStatus as jest.Mock).mockReturnValueOnce({
            getVerificationStatus: jest.fn().mockReturnValue({
                is_failed: false,
                is_pending: false,
            }),
        });

        renderComponent({
            landing_company_short: 'SVG',
            rights: { enabled: false },
            status: 'active',
        });

        expect(screen.queryByText('$10,000')).not.toBeInTheDocument();
    });
});
