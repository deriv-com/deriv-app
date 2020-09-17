import React from 'react';
import { Icon } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import {
    eu_real_financial_specs,
    real_financial_stp_specs,
    real_financial_specs,
    real_synthetic_specs,
} from 'Modules/MT5/Constants/mt5-specifications';
import { MT5AccountCard } from './mt5-account-card.jsx';

const getRealFinancialStpBtnLbl = (is_fully_authenticated, is_pending_authentication, has_required_credentials) => {
    if (is_fully_authenticated && has_required_credentials) {
        return <Localize i18n_default_text='Set your password' />;
    } else if (is_pending_authentication) {
        return <Localize i18n_default_text='Pending verification' />;
    }

    return <Localize i18n_default_text='Add real account' />;
};

const MT5RealAccountDisplay = ({
    has_real_account,
    is_eu,
    is_eu_enabled, // TODO [deriv-eu] remove is_eu_enabled once eu is released.
    is_eu_country,
    has_malta_account,
    has_maltainvest_account,
    is_fully_authenticated,
    is_pending_authentication,
    landing_companies,
    onSelectAccount,
    openAccountTransfer,
    openPasswordModal,
    current_list,
    has_mt5_account,
    openPasswordManager,
    account_settings,
    openAccountNeededModal,
    standpoint,
    is_logged_in,
}) => {
    const has_required_credentials =
        account_settings.citizen && account_settings.tax_identification_number && account_settings.tax_residence;

    const button_label = getRealFinancialStpBtnLbl(
        is_fully_authenticated,
        is_pending_authentication,
        has_required_credentials
    );

    const is_real_financial_stp_disabled = !has_real_account || is_pending_authentication;

    const onSelectRealSynthetic = () => {
        if (is_eu_enabled && is_eu && standpoint.malta && !has_malta_account) {
            // TODO [deriv-eu] remove is_eu_enabled once eu is released.
            openAccountNeededModal('malta', localize('Deriv Synthetic'), localize('DMT5 Synthetic'));
        } else {
            onSelectAccount({ type: 'synthetic', category: 'real' });
        }
    };
    const onSelectRealFinancial = () => {
        if (is_eu_enabled && is_eu && !has_maltainvest_account) {
            // TODO: [deriv-eu] remove is_eu_enabled when eu gets a release
            openAccountNeededModal('maltainvest', localize('Deriv Financial'), localize('DMT5 Real Financial'));
        } else {
            onSelectAccount({ type: 'financial', category: 'real' });
        }
    };
    const onSelectRealFinancialStp = () => {
        const account_type = {
            category: 'real',
            type: 'financial_stp',
        };
        if (is_fully_authenticated && has_required_credentials) {
            openPasswordModal(account_type);
        } else if ((!is_fully_authenticated && !is_real_financial_stp_disabled) || !has_required_credentials) {
            onSelectAccount(account_type);
        }
    };

    const onClickFundRealSynthetic = () =>
        openAccountTransfer(current_list['real.synthetic'], {
            category: 'real',
            type: 'synthetic',
        });
    const onClickFundRealFinancial = () =>
        openAccountTransfer(current_list['real.financial'], {
            category: 'real',
            type: 'financial',
        });
    const onClickFundRealFinancialStp = () =>
        openAccountTransfer(current_list['real.financial_stp'], {
            category: 'real',
            type: 'financial_stp',
        });
    const should_show_eu = (is_logged_in && is_eu) || (!is_logged_in && is_eu_country);
    return (
        <div className='mt5-real-accounts-display'>
            {(landing_companies?.mt_gaming_company?.financial || !is_logged_in) && (
                <MT5AccountCard
                    has_mt5_account={has_mt5_account}
                    icon={() => <Icon icon='IcMt5SyntheticPlatform' size={64} />}
                    title={localize('Synthetic')}
                    is_disabled={(!is_eu && !has_real_account) || (!is_eu_enabled && is_eu)} // TODO [deriv-eu] remove eu enabled check
                    type={{
                        category: 'real',
                        type: 'synthetic',
                    }}
                    is_logged_in={is_logged_in}
                    existing_data={current_list['real.synthetic']}
                    commission_message={localize('No commission')}
                    onSelectAccount={onSelectRealSynthetic}
                    onPasswordManager={openPasswordManager}
                    onClickFund={onClickFundRealSynthetic}
                    descriptor={localize(
                        'Trade CFDs on our Synthetic Indices that simulate real-world market movement.'
                    )}
                    specs={real_synthetic_specs}
                />
            )}

            {(landing_companies?.mt_financial_company?.financial || !is_logged_in) && (
                <MT5AccountCard
                    has_mt5_account={has_mt5_account}
                    is_disabled={(!is_eu && !has_real_account) || (!is_eu_enabled && is_eu)} // TODO [deriv-eu] remove eu enabled check
                    icon={() => <Icon icon='IcMt5FinancialPlatform' size={64} />}
                    title={localize('Financial')}
                    type={{
                        category: 'real',
                        type: 'financial',
                    }}
                    existing_data={current_list['real.financial']}
                    commission_message={localize('No commission')}
                    onSelectAccount={onSelectRealFinancial}
                    onPasswordManager={openPasswordManager}
                    onClickFund={onClickFundRealFinancial}
                    descriptor={
                        is_eu || is_eu_country
                            ? localize(
                                  'Trade commodities, cryptocurrencies, major (standard) and minor currency pairs with high leverage.'
                              )
                            : localize(
                                  'Trade commodities, cryptocurrencies, major (standard and micro-lots) and minor currency pairs with high leverage.'
                              )
                    }
                    specs={should_show_eu ? eu_real_financial_specs : real_financial_specs}
                    is_logged_in={is_logged_in}
                />
            )}
            {(landing_companies?.mt_financial_company?.financial_stp || !is_logged_in) && (
                <MT5AccountCard
                    has_mt5_account={has_mt5_account}
                    icon={() => <Icon icon='IcMt5FinancialStpPlatform' size={64} />}
                    title={localize('Financial STP')}
                    type={{
                        category: 'real',
                        type: 'financial_stp',
                    }}
                    is_logged_in={is_logged_in}
                    existing_data={current_list['real.financial_stp']}
                    commission_message={localize('No commission')}
                    onSelectAccount={onSelectRealFinancialStp}
                    button_label={button_label}
                    is_button_primary={is_pending_authentication}
                    onPasswordManager={openPasswordManager}
                    onClickFund={onClickFundRealFinancialStp}
                    descriptor={localize(
                        'Trade major, minor, exotic currency pairs, and cryptocurrencies with Straight-Through Processing (STP) of your orders direct to the market.'
                    )}
                    specs={real_financial_stp_specs}
                    is_disabled={!is_eu && is_real_financial_stp_disabled}
                />
            )}
        </div>
    );
};

export { MT5RealAccountDisplay };
