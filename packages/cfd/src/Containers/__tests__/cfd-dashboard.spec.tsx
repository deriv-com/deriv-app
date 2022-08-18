import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { fireEvent, render, screen } from '@testing-library/react';
import CFDDashboard from '../cfd-dashboard';
import { BrowserRouter } from 'react-router-dom';
import { CFD_PLATFORMS, getCFDPlatformLabel, routes } from '@deriv/shared';
import { DetailsOfEachMT5Loginid, LandingCompany } from '@deriv/api-types';

type TMockConnectProps = {
    isEligibleForMoreRealMt5: () => boolean;
    isEligibleForMoreDemoMt5Svg: () => boolean;
    setMT5TradeAccount: () => void;
    dxtrade_tokens: { [key: string]: string };
    landing_companies?: LandingCompany;
    current_list?: Record<
        string,
        DetailsOfEachMT5Loginid & { account_id?: string; display_login: string; enabled?: number; platform?: string }
    >;
};

type TRenderWithRouterParams = {
    rerender?: ReturnType<typeof render>['rerender'];
    component: React.ReactNode;
};

const mock_connect_props: TMockConnectProps = {
    isEligibleForMoreRealMt5: jest.fn(() => true),
    isEligibleForMoreDemoMt5Svg: jest.fn(() => true),
    setMT5TradeAccount: jest.fn(),
    dxtrade_tokens: {
        demo: '',
        real: '',
    },
};

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isLandingCompanyEnabled: jest.fn(() => true),
    getCFDPlatformLabel: jest.fn(() => 'DMT5'),
    routes: {
        bot: '/bot',
        cashier_acc_transfer: '/cashier/account-transfer',
        dxtrade: '/derivx',
        mt5: '/mt5',
        trade: '/',
    },
}));

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => props => Component({ ...props, ...mock_connect_props }),
}));
jest.mock('@deriv/account', () => ({
    ...jest.requireActual('@deriv/account'),
    ResetTradingPasswordModal: props => (props.is_visible ? 'ResetTradingPasswordModal' : ''),
}));
jest.mock('../../Components/success-dialog.jsx', () => () => 'SuccessDialog');
jest.mock('../cfd-password-modal.tsx', () => props => props.is_cfd_password_modal_enabled ? 'CFDPasswordModal' : '');
jest.mock('../cfd-top-up-demo-modal', () => props => props.is_top_up_virtual_open ? 'CFDTopUpDemoModal' : '');
jest.mock('../cfd-personal-details-modal', () => () => 'CFDPersonalDetailsModal');
jest.mock('../mt5-trade-modal', () => props => props.is_open ? 'MT5TradeModal' : '');
jest.mock('../jurisdiction-modal', () => props => props.is_jurisdiction_modal_visible ? 'JurisdictionModal' : '');

describe('<CFDDashboard />', () => {
    let props;
    beforeEach(() => {
        props = {
            account_status: {},
            beginRealSignupForMt5: jest.fn(),
            checkShouldOpenAccount: jest.fn(),
            country: 'Indonesia',
            createCFDAccount: jest.fn(),
            enableApp: jest.fn(),
            disableApp: jest.fn(),
            disableCFDPasswordModal: jest.fn(),
            dxtrade_accounts_list_error: null,
            dxtrade_disabled_signup_types: {
                demo: false,
                real: false,
            },
            dxtrade_verification_code: {},
            getRealSyntheticAccountsExistingData: jest.fn(),
            getRealFinancialAccountsExistingData: jest.fn(),
            has_maltainvest_account: false,
            has_mt5_real_account_error: false,
            has_mt5_demo_account_error: false,
            has_dxtrade_real_account_error: false,
            has_dxtrade_demo_account_error: false,
            has_real_account: true,
            is_accounts_switcher_on: false,
            is_dark_mode_on: false,
            is_eu: false,
            is_eu_country: false,
            is_loading: false,
            is_logged_in: false,
            is_logging_in: false,
            is_mt5_allowed: true,
            is_mt5_trade_modal_visible: false,
            is_dxtrade_allowed: true,
            is_reset_trading_password_modal_visible: false,
            is_virtual: false,
            isAccountOfTypeDisabled: jest.fn(() => false),
            location: {
                pathname: '/mt5',
                hash: '',
            },
            mt5_disabled_signup_types: {
                demo: false,
                real: false,
            },
            mt5_verification_code: {},
            mt5_status_server: {
                demo: [
                    {
                        all: 0,
                        platform: 1,
                        server_number: 1,
                    },
                    {
                        all: 0,
                        platform: 1,
                        server_number: 2,
                    },
                ],
                real: [
                    {
                        all: 0,
                        deposits: 0,
                        platform: 1,
                        server_number: 1,
                        withdrawals: 0,
                    },
                    {
                        all: 0,
                        deposits: 0,
                        platform: 1,
                        server_number: 2,
                        withdrawals: 0,
                    },
                ],
            },
            NotificationMessages: () => <div>NotificationMessages</div>,
            onMount: jest.fn(),
            onUnmount: jest.fn(),
            openAccountNeededModal: jest.fn(),
            openDerivRealAccountNeededModal: jest.fn(),
            openPasswordModal: jest.fn(),
            openTopUpModal: jest.fn(),
            platform: CFD_PLATFORMS.MT5,
            residence: 'id',
            residence_list: [
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {},
                                has_visual_sample: 0,
                                is_country_supported: 0,
                            },
                            onfido: {
                                documents_supported: {
                                    driving_licence: {
                                        display_name: 'Driving Licence',
                                    },
                                    national_identity_card: {
                                        display_name: 'National Identity Card',
                                    },
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '62',
                    text: 'Indonesia',
                    tin_format: ['^\\d{15}$'],
                    value: 'id',
                },
            ],
            setAccountType: jest.fn(),
            setCFDPasswordResetModal: jest.fn(),
            setCurrentAccount: jest.fn(),
            standpoint: {
                financial_company: 'svg',
                gaming_company: 'svg',
                iom: false,
                malta: false,
                maltainvest: false,
                svg: true,
            },
            toggleAccountsDialog: jest.fn(),
            toggleMT5TradeModal: jest.fn(),
            toggleShouldShowRealAccountsList: jest.fn(),
            toggleCFDPersonalDetailsModal: jest.fn(),
            toggleResetTradingPasswordModal: jest.fn(),
            upgradeable_landing_companies: ['svg'],
        };

        mock_connect_props.landing_companies = {
            config: {
                tax_details_required: 1,
                tin_format: ['^\\d{15}$'],
                tin_format_description: '999999999999999',
            },
            dxtrade_financial_company: {},
            dxtrade_gaming_company: {},
            financial_company: {},
            gaming_company: {},
            id: 'id',
            minimum_age: 18,
            mt_financial_company: {},
            mt_gaming_company: {},
            name: 'Indonesia',
            virtual_company: 'virtual',
        };
        mock_connect_props.current_list = {
            'mt5.real.synthetic_svg@p01_ts03': {
                account_type: 'real',
                balance: 0,
                country: 'id',
                currency: 'USD',
                display_balance: '0.00',
                display_login: '40005073',
                email: 'ma+1@deriv.com',
                group: 'real\\p01_ts03\\synthetic\\svg_std_usd\\02',
                landing_company_short: 'svg',
                leverage: 500,
                login: 'MTR40005073',
                market_type: 'synthetic',
                name: 'test_user',
                server: 'p01_ts03',
                server_info: {
                    environment: 'Deriv-Server',
                    geolocation: {
                        group: 'asia_synthetic',
                        location: 'Singapore',
                        region: 'Asia',
                        sequence: 1,
                    },
                    id: 'p01_ts03',
                },
                sub_account_type: 'financial',
            },
            'mt5.demo.synthetic_svg@p01_ts02': {
                account_type: 'demo',
                balance: 10000,
                country: 'id',
                currency: 'USD',
                display_balance: '10000.00',
                display_login: '20104105',
                email: 'ma+1@deriv.com',
                group: 'demo\\p01_ts02\\synthetic\\svg_std_usd',
                landing_company_short: 'svg',
                leverage: 500,
                login: 'MTD20104105',
                market_type: 'synthetic',
                name: 'test_user',
                server: 'p01_ts02',
                server_info: {
                    environment: 'Deriv-Demo',
                    geolocation: {
                        group: 'all',
                        location: 'N. Virginia',
                        region: 'US East',
                        sequence: 1,
                    },
                    id: 'p01_ts02',
                },
                sub_account_type: 'financial',
            },
            'dxtrade.real.synthetic@synthetic': {
                account_id: 'DXR1000',
                account_type: 'real',
                balance: 0,
                currency: 'USD',
                display_balance: '0.00',
                display_login: 'DXR1000',
                enabled: 1,
                landing_company_short: 'svg',
                login: '9',
                market_type: 'synthetic',
                platform: 'dxtrade',
            },
        };
        global.window.location.hash = '';
    });

    const dmt5_welcome_header = /welcome to deriv mt5 \(dmt5\) dashboard/i;
    const derivx_welcome_header = /welcome to deriv x/i;
    const real_tab_name = 'Real account';
    const demo_tab_name = 'Demo account';
    const compare_accounts_button_label = /compare accounts/i;
    const account_information_button_label = /account information/i;
    const top_up_button_label = /top up/i;
    const dmt5_download_header = /run mt5 from your browser or download the mt5 app for your devices/i;
    const derivx_download_header = /run deriv x on your browser or download the mobile app/i;
    const mt5_account_error = /some of your dmt5 accounts are unavailable at the moment./i;
    const dxtrade_account_error = /some of your deriv X accounts are unavailable at the moment./i;

    const renderwithRouter = ({ component, rerender }: TRenderWithRouterParams) => {
        const ui = (
            <div id='deriv_app'>
                <BrowserRouter>{component}</BrowserRouter>
            </div>
        );
        if (rerender) return rerender(ui);
        return render(ui);
    };

    it('CFDDashboard should be rendered correctly for DMT5 & for Deriv X', () => {
        const { rerender } = renderwithRouter({ component: <CFDDashboard {...props} /> }) as ReturnType<typeof render>;

        expect(screen.getByRole('heading', { name: dmt5_welcome_header })).toBeInTheDocument();
        expect(screen.getByText('NotificationMessages')).toBeInTheDocument();
        expect(screen.getByText(real_tab_name)).toBeInTheDocument();
        expect(screen.getByText(demo_tab_name)).toBeInTheDocument();
        expect(screen.getByText('Synthetic')).toBeInTheDocument();
        expect(screen.getByText('Financial')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: compare_accounts_button_label })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: dmt5_download_header })).toBeInTheDocument();
        screen.queryAllByText(/modal/i).forEach(modal => {
            expect(modal).not.toBeInTheDocument();
        });

        renderwithRouter({
            rerender,
            component: <CFDDashboard {...props} platform={CFD_PLATFORMS.DXTRADE} location={{ pathname: '/derivx' }} />,
        });

        expect(screen.getByRole('heading', { name: derivx_welcome_header })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: derivx_download_header })).toBeInTheDocument();
    });
    it('Real account tab is active initially, and Demo account tab gets active when clicked', () => {
        renderwithRouter({ component: <CFDDashboard {...props} /> });

        const real_account_tab = screen.getByText(real_tab_name);
        const demo_account_tab = screen.getByText(demo_tab_name);
        expect(real_account_tab).toHaveClass('dc-tabs__active');
        expect(demo_account_tab).not.toHaveClass('dc-tabs__active');
        expect(screen.queryByText('DEMO')).not.toBeInTheDocument();

        fireEvent.click(demo_account_tab);
        expect(demo_account_tab).toHaveClass('dc-tabs__active');
        expect(real_account_tab).not.toHaveClass('dc-tabs__active');
        expect(screen.getAllByText('DEMO').length).toBeGreaterThan(0);
    });
    it('Compare accounts button disappears when switched to Demo tab in DMT5', () => {
        renderwithRouter({ component: <CFDDashboard {...props} /> });

        expect(screen.getByRole('button', { name: compare_accounts_button_label })).toBeInTheDocument();

        fireEvent.click(screen.getByText(demo_tab_name));
        expect(screen.queryByRole('button', { name: compare_accounts_button_label })).not.toBeInTheDocument();
    });
    it('Compare accounts button is named Account Information for logged-in EU users in DMT5', () => {
        mock_connect_props.current_list = {};
        mock_connect_props.landing_companies = {
            config: {
                tin_format: ['^\\d{10,11}$'],
                tin_format_description: '9999999999 or 99999999999',
            },
            financial_company: {},
            id: 'pl',
            minimum_age: 18,
            mt_financial_company: {
                financial: {
                    address: [],
                    changeable_fields: {},
                    country: 'Malta',
                    currency_config: {},
                    has_reality_check: 0,
                    legal_allowed_contract_categories: [],
                    legal_allowed_currencies: [],
                    legal_allowed_markets: [],
                    legal_default_currency: 'EUR',
                    name: 'Deriv Investments (Europe) Limited',
                    requirements: {},
                    shortcode: 'maltainvest',
                    support_professional_client: 1,
                },
            },
            name: 'Poland',
            virtual_company: 'virtual',
        };
        const { rerender } = renderwithRouter({
            component: <CFDDashboard {...props} is_logged_in is_eu />,
        }) as ReturnType<typeof render>;

        expect(screen.getByRole('button', { name: account_information_button_label })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: compare_accounts_button_label })).not.toBeInTheDocument();

        mock_connect_props.landing_companies = {};
        renderwithRouter({
            rerender,
            component: <CFDDashboard {...props} is_logged_in={false} is_eu_country />,
        });

        expect(screen.getByRole('button', { name: compare_accounts_button_label })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: account_information_button_label })).not.toBeInTheDocument();
    });
    it('Should show error when is_logged_in & has real/demo account error in DMT5/Deriv X', () => {
        const { rerender } = renderwithRouter({
            component: <CFDDashboard {...props} is_logged_in has_mt5_real_account_error />,
        }) as ReturnType<typeof render>;

        expect(screen.getByText(mt5_account_error)).toBeInTheDocument();

        renderwithRouter({
            rerender,
            component: <CFDDashboard {...props} is_logged_in has_mt5_demo_account_error />,
        });
        fireEvent.click(screen.getByText(demo_tab_name));
        expect(screen.getByText(mt5_account_error)).toBeInTheDocument();

        (getCFDPlatformLabel as jest.Mock).mockReturnValue('Deriv X');
        renderwithRouter({
            rerender,
            component: (
                <CFDDashboard
                    {...props}
                    is_logged_in
                    platform={CFD_PLATFORMS.DXTRADE}
                    location={{ pathname: '/derivx' }}
                    has_dxtrade_demo_account_error
                />
            ),
        });
        expect(screen.getByText(dxtrade_account_error)).toBeInTheDocument();

        renderwithRouter({
            rerender,
            component: (
                <CFDDashboard
                    {...props}
                    is_logged_in
                    platform={CFD_PLATFORMS.DXTRADE}
                    location={{ pathname: '/derivx' }}
                    has_dxtrade_real_account_error
                />
            ),
        });
        fireEvent.click(screen.getByText(real_tab_name));
        expect(screen.getByText(dxtrade_account_error)).toBeInTheDocument();
    });
    it('Should show Loading when is_loading or when is_logging_in in DMT5/Deriv X', () => {
        const { rerender } = renderwithRouter({
            component: <CFDDashboard {...props} platform={CFD_PLATFORMS.MT5} is_loading />,
        }) as ReturnType<typeof render>;
        expect(screen.getByTestId('dt_initial_loader')).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: dmt5_welcome_header })).not.toBeInTheDocument();

        renderwithRouter({
            rerender,
            component: <CFDDashboard {...props} platform={CFD_PLATFORMS.DXTRADE} is_logging_in />,
        });
        expect(screen.getByTestId('dt_initial_loader')).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: derivx_welcome_header })).not.toBeInTheDocument();
    });
    it('Should show PageError when is_logged_in to DMT5 & mt5 in not allowed', () => {
        renderwithRouter({
            component: <CFDDashboard {...props} is_logged_in platform={CFD_PLATFORMS.MT5} is_mt5_allowed={false} />,
        });

        expect(screen.getByRole('heading', { name: /dmt5 is not available in indonesia/i })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: dmt5_welcome_header })).not.toBeInTheDocument();
    });
    it('Should ask to open a real Deriv account when is_logged_in && !has_real_account && upgradeable_landing_companies.length > 0 in DMT5', () => {
        renderwithRouter({
            component: (
                <CFDDashboard
                    {...props}
                    is_logged_in
                    platform={CFD_PLATFORMS.MT5}
                    location={{ pathname: '/mt5' }}
                    has_real_account={false}
                />
            ),
        });
        expect(screen.getByRole('heading', { name: /you need a real account/i })).toBeInTheDocument();
    });
    it('Should redirect a user to DMT5 when Deriv X is not allowed', () => {
        renderwithRouter({
            component: (
                <CFDDashboard
                    {...props}
                    is_dxtrade_allowed={false}
                    platform={CFD_PLATFORMS.DXTRADE}
                    location={{ pathname: '/derivx' }}
                />
            ),
        });
        expect(global.window.location.pathname).toBe(routes.mt5);
        expect(screen.queryByRole('heading', { name: derivx_welcome_header })).not.toBeInTheDocument();
    });
    it('Top up button in DMT5 (= Fund transfer button in Deriv X) should redirect to Cashier when in Real, & should trigger CFDTopUpDemoModal when in Demo', () => {
        const { rerender } = renderwithRouter({
            component: <CFDDashboard {...props} is_logged_in />,
        }) as ReturnType<typeof render>;
        fireEvent.click(screen.getByRole('button', { name: top_up_button_label }));
        expect(props.disableCFDPasswordModal).toHaveBeenCalledTimes(1);
        expect(global.window.location.pathname).toBe(routes.cashier_acc_transfer);

        global.window.location = { pathname: routes.dxtrade, hash: '' } as (string | Location) & Location;
        renderwithRouter({
            rerender,
            component: <CFDDashboard {...props} is_logged_in platform={CFD_PLATFORMS.DXTRADE} />,
        });
        fireEvent.click(screen.getByRole('button', { name: /fund transfer/i }));
        expect(props.disableCFDPasswordModal).toHaveBeenCalledTimes(2);
        expect(global.window.location.pathname).toBe(routes.cashier_acc_transfer);

        renderwithRouter({
            rerender,
            component: <CFDDashboard {...props} is_logged_in platform={CFD_PLATFORMS.MT5} />,
        });
        fireEvent.click(screen.getByText(demo_tab_name));
        fireEvent.click(screen.getByRole('button', { name: top_up_button_label }));
        expect(props.setCurrentAccount).toHaveBeenCalledWith(
            mock_connect_props.current_list?.['mt5.demo.synthetic_svg@p01_ts02'],
            {
                category: 'demo',
                type: 'synthetic',
            }
        );
        expect(props.openTopUpModal).toHaveBeenCalledTimes(1);
    });
    it('Trade button should trigger MT5TradeModal when clicked', () => {
        renderwithRouter({
            component: <CFDDashboard {...props} is_logged_in />,
        });

        const dmt5_trade_button = screen.getByRole('button', { name: 'Trade' });
        fireEvent.click(dmt5_trade_button);
        expect(props.toggleMT5TradeModal).toHaveBeenCalledTimes(1);
    });
    it('Should trigger CFDResetPasswordModal when URL hash contains reset-password', () => {
        global.window.location.hash = 'reset-password';
        renderwithRouter({
            component: <CFDDashboard {...props} is_logged_in />,
        });

        expect(props.setCFDPasswordResetModal).toHaveBeenCalledWith(true);
    });
});
