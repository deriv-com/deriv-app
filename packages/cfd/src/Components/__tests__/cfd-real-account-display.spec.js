import { fireEvent, render, screen, within } from '@testing-library/react';
import React from 'react';
import { CFDRealAccountDisplay } from '../cfd-real-account-display';

describe('<CFDRealAccountDisplay />', () => {
    const standard_company = {
        address: null,
        changeable_fields: {},
        country: 'Saint Vincent and the Grenadines',
        currency_config: {},
        has_reality_check: 0,
        legal_allowed_contract_categories: {},
        legal_allowed_currencies: {},
        legal_allowed_markets: {},
        legal_default_currency: 'USD',
        name: 'Deriv (SVG) LLC',
        requirements: {},
        shortcode: 'svg',
        support_professional_client: 0,
    };

    const account_settings_eu = {
        account_opening_reason: 'Income Earning',
        address_city: 'warsaw',
        address_line_1: 'test',
        address_line_2: 'test',
        address_postcode: '3243233',
        address_state: 'MZ',
        allow_copiers: 0,
        citizen: 'pl',
        client_tnc_status: 'Version 4.2.0 2020-08-07',
        country: 'Poland',
        country_code: 'pl',
        date_of_birth: 137894400,
        email: 'maryia+146@binary.com',
        email_consent: 1,
        feature_flag: {
            wallet: 0,
        },
        first_name: 'Maryia',
        has_secret_answer: 1,
        immutable_fields: [
            'account_opening_reason',
            'citizen',
            'date_of_birth',
            'first_name',
            'last_name',
            'place_of_birth',
            'residence',
            'salutation',
        ],
        is_authenticated_payment_agent: 0,
        last_name: 'gggg',
        non_pep_declaration: 1,
        phone: '+48354334543434',
        place_of_birth: 'pl',
        preferred_language: 'EN',
        request_professional_status: 0,
        residence: 'Poland',
        salutation: 'Ms',
        tax_identification_number: '3432324232',
        tax_residence: 'pl',
        user_hash: 'f8029d070387e67bdfbc3857021382905b1513a42386c7278fd352852e11f06f',
    };

    const mt5_real_synthetic_account = {
        account_type: 'real',
        balance: 0,
        country: 'id',
        currency: 'USD',
        display_balance: '0.00',
        display_login: '41165492',
        email: 'maryia+146@binary.com',
        group: 'real\\p01_ts03\\synthetic\\svg_std_usd\\03',
        landing_company_short: 'svg',
        leverage: 500,
        login: 'MTR41165492',
        market_type: 'synthetic',
        name: 'Maryia gggg',
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
    };

    const mt5_real_financial_account = {
        account_type: 'real',
        balance: 0,
        country: 'id',
        currency: 'USD',
        display_balance: '0.00',
        display_login: '1927245',
        email: 'maryia+146@binary.com',
        group: 'real\\p01_ts01\\financial\\svg_std-hr_usd',
        landing_company_short: 'svg',
        leverage: 1000,
        login: 'MTR1927245',
        market_type: 'financial',
        name: 'Maryia gggg',
        server: 'p01_ts01',
        server_info: {
            environment: 'Deriv-Server',
            geolocation: {
                group: 'all',
                location: 'Ireland',
                region: 'Europe',
                sequence: 1,
            },
            id: 'p01_ts01',
        },
        sub_account_type: 'financial',
    };

    let props;

    beforeEach(() => {
        props = {
            account_settings: {
                account_opening_reason: 'Income Earning',
                address_city: 'Jakarta',
                address_line_1: 'test',
                address_line_2: 'test',
                address_postcode: '11111',
                address_state: 'BA',
                allow_copiers: 0,
                citizen: 'id',
                client_tnc_status: 'Version 4.2.0 2020-08-07',
                country: 'Indonesia',
                country_code: 'id',
                date_of_birth: -178416000,
                email: 'maryia+146@deriv.com',
                email_consent: 1,
                feature_flag: {
                    wallet: 0,
                },
                first_name: 'Maryia',
                has_secret_answer: 1,
                immutable_fields: ['residence'],
                is_authenticated_payment_agent: 0,
                last_name: 'gggg',
                non_pep_declaration: 1,
                phone: '04546575786',
                place_of_birth: null,
                preferred_language: 'EN',
                request_professional_status: 0,
                residence: 'Indonesia',
                salutation: '',
                tax_identification_number: '121241413236757',
                tax_residence: 'id',
                user_hash: '4f284ce90658a122e8d1cdafaf34564a7c4510f3fd73486029671fa62c46ccb6',
            },
            can_have_more_real_synthetic_mt5: false,
            current_list: {},
            has_cfd_account: false,
            has_cfd_account_error: false,
            has_malta_account: false,
            has_maltainvest_account: false,
            has_real_account: true,
            is_accounts_switcher_on: false,
            is_eu: false,
            is_eu_country: false, // depends on client IP address
            is_fully_authenticated: false,
            is_logged_in: true,
            is_pending_authentication: false,
            is_virtual: false,
            isAccountOfTypeDisabled: jest.fn(() => false),
            isSyntheticCardVisible: jest.fn(() => true),
            isFinancialCardVisible: jest.fn(() => true),
            isFinancialStpCardVisible: jest.fn(() => true),
            landing_companies: {
                config: {
                    tax_details_required: 1,
                    tin_format: ['^\\d{15}$'],
                    tin_format_description: '999999999999999',
                },
                dxtrade_financial_company: {
                    standard: standard_company,
                },
                dxtrade_gaming_company: {
                    standard: standard_company,
                },
                financial_company: standard_company,
                gaming_company: standard_company,
                id: 'id',
                minimum_age: 18,
                mt_financial_company: {
                    financial: standard_company,
                    financial_stp: {
                        address: [
                            'Labuan Times Square',
                            'Jalan Merdeka',
                            '87000 Federal Territory of Labuan',
                            'Malaysia',
                        ],
                        changeable_fields: {},
                        country: 'Malaysia',
                        currency_config: {},
                        has_reality_check: 0,
                        legal_allowed_contract_categories: {},
                        legal_allowed_currencies: {},
                        legal_allowed_markets: {},
                        legal_default_currency: 'USD',
                        name: 'Deriv (FX) Ltd',
                        requirements: {},
                        shortcode: 'labuan',
                        support_professional_client: 0,
                    },
                },
                mt_gaming_company: {
                    financial: standard_company,
                },
                name: 'Indonesia',
                virtual_company: 'virtual',
            },
            onSelectAccount: jest.fn(),
            openAccountNeededModal: jest.fn(),
            openAccountTransfer: jest.fn(),
            openPasswordManager: jest.fn(),
            openPasswordModal: jest.fn(),
            platform: 'mt5',
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
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {},
                                has_visual_sample: 0,
                                is_country_supported: 0,
                            },
                            onfido: {
                                documents_supported: {},
                                is_country_supported: 0,
                            },
                        },
                    },
                    phone_idd: '35818',
                    text: 'Aland Islands',
                    value: 'ax',
                },
            ],
            standpoint: {
                financial_company: 'svg',
                gaming_company: 'svg',
                iom: false,
                malta: false,
                maltainvest: false,
                svg: true,
            },
            toggleAccountsDialog: jest.fn(),
            toggleShouldShowRealAccountsList: jest.fn(),
        };
    });

    it('should render Synthetic, Financial & Financial STP cards with enabled buttons on DMT5 for logged-in non-EU client', () => {
        render(<CFDRealAccountDisplay {...props} />);

        const add_real_account_buttons = screen.getAllByRole('button', { name: /add real account/i });

        expect(screen.getByTestId('dt_cfd_real_accounts_display')).toBeInTheDocument();
        expect(screen.getByText('Synthetic')).toBeInTheDocument();
        expect(screen.getByText('Financial')).toBeInTheDocument();
        expect(screen.getByText('Financial STP')).toBeInTheDocument();
        expect(screen.getAllByRole('table').length).toBe(3);
        expect(screen.getAllByRole('cell', { name: /leverage/i }).length).toBe(3);
        expect(screen.getAllByRole('cell', { name: /margin call/i }).length).toBe(3);
        expect(screen.getAllByRole('cell', { name: /stop out level/i }).length).toBe(3);
        expect(screen.getAllByRole('cell', { name: /number of assets/i }).length).toBe(3);
        expect(add_real_account_buttons.length).toBe(3);

        fireEvent.click(add_real_account_buttons[0]);
        expect(props.onSelectAccount).toHaveBeenCalledWith({ type: 'synthetic', category: 'real' });

        fireEvent.click(add_real_account_buttons[1]);
        expect(props.onSelectAccount).toHaveBeenCalledWith({ type: 'financial', category: 'real' });

        fireEvent.click(add_real_account_buttons[2]);
        expect(props.onSelectAccount).toHaveBeenCalledWith({ type: 'financial_stp', category: 'real' });
    });

    it('should render Synthetic, Financial & Financial STP cards without "Add real account" buttons on DMT5 for logged-out client with non-EU IP address', () => {
        render(<CFDRealAccountDisplay {...props} is_logged_in={false} />);

        expect(screen.getByTestId('dt_cfd_real_accounts_display')).toBeInTheDocument();
        expect(screen.getByText('Synthetic')).toBeInTheDocument();
        expect(screen.getByText('Financial')).toBeInTheDocument();
        expect(screen.getByText('Financial STP')).toBeInTheDocument();
        expect(screen.getAllByRole('table').length).toBe(3);
        expect(screen.queryAllByRole('button', { name: /add real account/i }).length).toBe(0);
    });

    it('should render a CFDs card only with enabled "Add real account" button on DMT5 for logged-in EU client', () => {
        props.isSyntheticCardVisible = jest.fn(() => false);
        props.isFinancialStpCardVisible = jest.fn(() => false);
        render(<CFDRealAccountDisplay {...props} is_eu account_settings={account_settings_eu} />);

        const add_real_account_button = screen.getByRole('button', { name: /add real account/i });

        expect(screen.getByTestId('dt_cfd_real_accounts_display')).toBeInTheDocument();
        expect(screen.getByText('CFDs')).toBeInTheDocument();
        expect(screen.queryByText('Synthetic')).not.toBeInTheDocument();
        expect(screen.queryByText('Financial')).not.toBeInTheDocument();
        expect(screen.queryByText('Financial STP')).not.toBeInTheDocument();
        expect(screen.getAllByRole('table').length).toBe(1);
        expect(add_real_account_button).toBeEnabled();

        fireEvent.click(add_real_account_button);
        expect(props.openAccountNeededModal).toHaveBeenCalledWith('maltainvest', 'Deriv Multipliers', 'real CFDs');
    });

    it('should render a CFDs card only without "Add real account" button on DMT5 for logged-out client with EU IP address (also when redirected from Deriv X platform)', () => {
        props.isSyntheticCardVisible = jest.fn(() => false);
        props.isFinancialStpCardVisible = jest.fn(() => false);
        render(<CFDRealAccountDisplay {...props} is_logged_in={false} is_eu_country />);

        expect(screen.getByTestId('dt_cfd_real_accounts_display')).toBeInTheDocument();
        expect(screen.getByText('CFDs')).toBeInTheDocument();
        expect(screen.queryByText('Synthetic')).not.toBeInTheDocument();
        expect(screen.queryByText('Financial')).not.toBeInTheDocument();
        expect(screen.queryByText('Financial STP')).not.toBeInTheDocument();
        expect(screen.getAllByRole('table').length).toBe(1);
        expect(screen.queryAllByRole('button', { name: /add real account/i }).length).toBe(0);
    });

    it('should render Synthetic & Financial cards with enabled buttons on Deriv X for logged-in non-EU client', () => {
        props.isFinancialStpCardVisible = jest.fn(() => false);
        render(<CFDRealAccountDisplay {...props} platform='dxtrade' />);

        const add_real_account_buttons = screen.getAllByRole('button', { name: /add real account/i });

        expect(screen.getByTestId('dt_cfd_real_accounts_display')).toBeInTheDocument();
        expect(screen.getByText('Synthetic')).toBeInTheDocument();
        expect(screen.getByText('Financial')).toBeInTheDocument();
        expect(screen.queryByText('Financial STP')).not.toBeInTheDocument();
        expect(screen.getAllByRole('table').length).toBe(2);
        expect(screen.getAllByRole('cell', { name: /leverage/i }).length).toBe(2);
        expect(screen.getAllByRole('cell', { name: /margin call/i }).length).toBe(2);
        expect(screen.getAllByRole('cell', { name: /stop out level/i }).length).toBe(2);
        expect(screen.getAllByRole('cell', { name: /number of assets/i }).length).toBe(2);
        expect(add_real_account_buttons.length).toBe(2);

        fireEvent.click(add_real_account_buttons[0]);
        expect(props.onSelectAccount).toHaveBeenCalledWith({ type: 'synthetic', category: 'real' });

        fireEvent.click(add_real_account_buttons[1]);
        expect(props.onSelectAccount).toHaveBeenCalledWith({ type: 'financial', category: 'real' });
    });

    it('should render Synthetic & Financial cards without "Add real account" buttons on Deriv X for logged-out client with non-EU IP address', () => {
        props.isFinancialStpCardVisible = jest.fn(() => false);
        render(<CFDRealAccountDisplay {...props} is_logged_in={false} platform='dxtrade' />);

        expect(screen.getByTestId('dt_cfd_real_accounts_display')).toBeInTheDocument();
        expect(screen.getByText('Synthetic')).toBeInTheDocument();
        expect(screen.getByText('Financial')).toBeInTheDocument();
        expect(screen.queryByText('Financial STP')).not.toBeInTheDocument();
        expect(screen.getAllByRole('table').length).toBe(2);
        expect(screen.queryAllByRole('button', { name: /add real account/i }).length).toBe(0);
    });

    it('should render 1 open real financial DMT5 account with enabled buttons password reset button, "Fund transfer" & "Trade on web terminal" buttons', () => {
        props.current_list['mt5.real.financial@p01_ts01'] = mt5_real_financial_account;
        const { container } = render(<CFDRealAccountDisplay {...props} has_real_account={true} />);

        expect(screen.getByTestId('dt_cfd_real_accounts_display')).toBeInTheDocument();
        expect(screen.getByText('Synthetic')).toBeInTheDocument();
        expect(screen.getByText('Financial')).toBeInTheDocument();
        expect(screen.getByText('Financial STP')).toBeInTheDocument();
        expect(screen.getAllByRole('table').length).toBe(3);
        expect(screen.getAllByRole('button', { name: /add real account/i }).length).toBe(2);
        const password_table_cells = screen.getAllByRole('cell', { name: /•••••••••••••••/i });
        expect(password_table_cells.length).toBe(1);
        const change_password_button = within(password_table_cells[0]).getByRole('button');
        const within_financial = within(container.querySelector('#real-financial'));
        const fund_transfer_button = within_financial.getByRole('button', { name: /fund transfer/i });
        const trade_on_web_terminal_button = within_financial.getByRole('link', { name: /trade on web terminal/i });
        expect(trade_on_web_terminal_button).toHaveAttribute(
            'href',
            'https://trade.mql5.com/trade?servers=Deriv-Server&trade_server=Deriv-Server&login=1927245'
        );

        fireEvent.click(change_password_button);
        expect(props.openPasswordManager).toHaveBeenCalledTimes(1);

        fireEvent.click(fund_transfer_button);
        expect(props.openAccountTransfer).toHaveBeenCalledWith(props.current_list['mt5.real.financial@p01_ts01'], {
            category: 'real',
            type: 'financial',
        });
    });

    it('should show "Switch to your real account", which is needed to open Account Switcher, on Financial STP card when has_real_account=true & is_virtual=true', () => {
        const { container } = render(<CFDRealAccountDisplay {...props} is_virtual />);

        expect(screen.getByTestId('dt_cfd_real_accounts_display')).toBeInTheDocument();
        expect(screen.getByText('Synthetic')).toBeInTheDocument();
        expect(screen.getByText('Financial')).toBeInTheDocument();
        expect(screen.getByText('Financial STP')).toBeInTheDocument();
        expect(screen.getAllByRole('button', { name: /add real account/i }).length).toBe(2);
        const switch_to_real_account_link = within(container.querySelector('#real-financial_stp')).getByText(
            'Switch to your real account'
        );

        fireEvent.click(switch_to_real_account_link);
        expect(props.toggleShouldShowRealAccountsList).toHaveBeenCalledWith(true);
        expect(props.toggleAccountsDialog).toHaveBeenCalledWith(true);
    });

    it('should show a disabled "Pending verification" button on Financial STP card when is_pending_authentication is true', () => {
        const { container } = render(<CFDRealAccountDisplay {...props} is_pending_authentication />);

        expect(screen.getByTestId('dt_cfd_real_accounts_display')).toBeInTheDocument();
        expect(screen.getByText('Synthetic')).toBeInTheDocument();
        expect(screen.getByText('Financial')).toBeInTheDocument();
        expect(screen.getByText('Financial STP')).toBeInTheDocument();
        expect(screen.getAllByRole('button', { name: /add real account/i }).length).toBe(2);
        const within_stp = within(container.querySelector('#real-financial_stp'));
        expect(within_stp.queryAllByRole('button', { name: /add real account/i })).toEqual([]);
        const pending_verification_button = within_stp.getByRole('button', { name: /pending verification/i });
        expect(pending_verification_button).toBeDisabled();
    });

    it('should show a "Set your password" button on Financial STP card when citizenship, tax residence & tax id (if required) are filled out & is_fully_authenticated=true', () => {
        const { container, rerender } = render(<CFDRealAccountDisplay {...props} is_fully_authenticated />);

        expect(screen.getByTestId('dt_cfd_real_accounts_display')).toBeInTheDocument();
        expect(screen.getByText('Synthetic')).toBeInTheDocument();
        expect(screen.getByText('Financial')).toBeInTheDocument();
        expect(screen.getByText('Financial STP')).toBeInTheDocument();
        expect(screen.getAllByRole('button', { name: /add real account/i }).length).toBe(2);

        const within_stp = within(container.querySelector('#real-financial_stp'));
        expect(within_stp.queryByRole('button', { name: /add real account/i })).not.toBeInTheDocument();
        expect(within_stp.getByRole('button', { name: /set your password/i })).toBeInTheDocument();

        const settings_with_empty_tax_id = {
            citizen: 'id',
            tax_residence: 'id',
            tax_identification_number: '',
        };
        const landing_companies_with_unrequired_tax_id = { config: { tax_details_required: 0 } };
        const residence_list_with_unrequired_tax_id = [{ value: 'id', tin_format: undefined }];
        rerender(
            <CFDRealAccountDisplay {...props} is_fully_authenticated account_settings={settings_with_empty_tax_id} />
        );
        expect(screen.queryByRole('button', { name: /set your password/i })).not.toBeInTheDocument();
        expect(within_stp.getByRole('button', { name: /add real account/i })).toBeInTheDocument();

        rerender(
            <CFDRealAccountDisplay
                {...props}
                is_fully_authenticated
                account_settings={settings_with_empty_tax_id}
                landing_companies={landing_companies_with_unrequired_tax_id}
                residence_list={[{ value: 'id', tin_format: ['^\\d{15}$'] }]}
            />
        );
        expect(within_stp.queryByRole('button', { name: /add real account/i })).not.toBeInTheDocument();
        expect(within_stp.getByRole('button', { name: /set your password/i })).toBeInTheDocument();

        rerender(
            <CFDRealAccountDisplay
                {...props}
                is_fully_authenticated
                account_settings={settings_with_empty_tax_id}
                landing_companies={{ config: { tax_details_required: 1 } }}
                residence_list={residence_list_with_unrequired_tax_id}
            />
        );
        expect(within_stp.queryByRole('button', { name: /add real account/i })).not.toBeInTheDocument();
        expect(within_stp.getByRole('button', { name: /set your password/i })).toBeInTheDocument();

        rerender(
            <CFDRealAccountDisplay
                {...props}
                is_fully_authenticated
                account_settings={settings_with_empty_tax_id}
                landing_companies={landing_companies_with_unrequired_tax_id}
                residence_list={residence_list_with_unrequired_tax_id}
            />
        );
        expect(within_stp.queryByRole('button', { name: /add real account/i })).not.toBeInTheDocument();

        fireEvent.click(within_stp.getByRole('button', { name: /set your password/i }));
        expect(props.openPasswordModal).toHaveBeenCalledWith({ category: 'real', type: 'financial_stp' });
    });

    it('should disable all "Add real account" buttons when has_cfd_account_error=true', () => {
        render(<CFDRealAccountDisplay {...props} has_cfd_account_error />);

        const add_real_account_buttons = screen.getAllByRole('button', { name: /add real account/i });
        expect(screen.getByTestId('dt_cfd_real_accounts_display')).toBeInTheDocument();
        expect(screen.getByText('Synthetic')).toBeInTheDocument();
        expect(screen.getByText('Financial')).toBeInTheDocument();
        expect(screen.getByText('Financial STP')).toBeInTheDocument();
        expect(add_real_account_buttons[0]).toBeDisabled();
        expect(add_real_account_buttons[1]).toBeDisabled();
        expect(add_real_account_buttons[2]).toBeDisabled();
    });

    it('should show "+ Add region" under Synthetic card with an open real account when can_have_more_real_synthetic_mt5=true', () => {
        props.current_list['mt5.real.synthetic@p01_ts03'] = mt5_real_synthetic_account;
        render(<CFDRealAccountDisplay {...props} can_have_more_real_synthetic_mt5 />);

        const add_real_account_buttons = screen.getAllByRole('button', { name: /add real account/i });
        expect(screen.getByTestId('dt_cfd_real_accounts_display')).toBeInTheDocument();
        expect(screen.getByText('Synthetic')).toBeInTheDocument();
        expect(screen.getByText('Financial')).toBeInTheDocument();
        expect(screen.getByText('Financial STP')).toBeInTheDocument();
        expect(add_real_account_buttons.length).toBe(2);
        expect(screen.getByText('+')).toBeInTheDocument();
        const add_region_button = screen.getByText(/add region/i);

        fireEvent.click(add_region_button);
        expect(props.onSelectAccount).toHaveBeenCalledTimes(1);
    });

    it('should show special specifications on Financial card when residence="au"', () => {
        const { rerender, container } = render(<CFDRealAccountDisplay {...props} residence='au' />);

        const within_financial = within(container.querySelector('#real-financial'));
        expect(within_financial.getByRole('row', { name: /leverage up to 1:30/i })).toBeInTheDocument();
        expect(within_financial.getByRole('row', { name: /margin call 100%/i })).toBeInTheDocument();
        expect(within_financial.getByRole('row', { name: /stop out level 50%/i })).toBeInTheDocument();
        expect(within_financial.getByRole('row', { name: /number of assets 100\+/i })).toBeInTheDocument();

        rerender(<CFDRealAccountDisplay {...props} platform='dxtrade' />);

        expect(within_financial.getByRole('row', { name: /number of assets 90\+/i })).toBeInTheDocument();
    });

    it('should render enabled "Select" buttons instead of "Add real account" buttons when has_cfd_account=true', () => {
        render(<CFDRealAccountDisplay {...props} has_cfd_account />);

        expect(screen.getByTestId('dt_cfd_real_accounts_display')).toBeInTheDocument();
        expect(screen.queryAllByRole('button', { name: /add real account/i }).length).toBe(0);

        const select_buttons = screen.getAllByText(/select/i);

        fireEvent.click(select_buttons[0]);
        expect(props.onSelectAccount).toHaveBeenCalledWith({ type: 'synthetic', category: 'real' });

        fireEvent.click(select_buttons[1]);
        expect(props.onSelectAccount).toHaveBeenCalledWith({ type: 'financial', category: 'real' });

        fireEvent.click(select_buttons[2]);
        expect(props.onSelectAccount).toHaveBeenCalledWith({ type: 'financial_stp', category: 'real' });
    });
});
