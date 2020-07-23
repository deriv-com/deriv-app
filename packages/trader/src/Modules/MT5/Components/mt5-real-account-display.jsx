import React from 'react';
import { Icon } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import {
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
    is_fully_authenticated,
    is_pending_authentication,
    onSelectAccount,
    openAccountTransfer,
    openPasswordModal,
    current_list,
    has_mt5_account,
    openPasswordManager,
    account_settings,
    is_logged_in,
    is_eu,
    is_eu_country,
}) => {
    const has_required_credentials =
        account_settings.citizen && account_settings.tax_identification_number && account_settings.tax_residence;

    const button_label = getRealFinancialStpBtnLbl(
        is_fully_authenticated,
        is_pending_authentication,
        has_required_credentials
    );

    const is_real_financial_stp_disabled = !has_real_account || is_pending_authentication;

    const onSelectRealSynthetic = () => onSelectAccount({ type: 'synthetic', category: 'real' });
    const onSelectRealFinancial = () => onSelectAccount({ type: 'financial', category: 'real' });
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

    return (
        <div className='mt5-real-accounts-display'>
            <MT5AccountCard
                has_mt5_account={has_mt5_account}
                icon={() => <Icon icon='IcMt5SyntheticPlatform' size={64} />}
                title={localize('Synthetic')}
                is_disabled={!has_real_account}
                type={{
                    category: 'real',
                    type: 'synthetic',
                }}
                existing_data={current_list['real.synthetic']}
                commission_message={<Localize i18n_default_text='No commission' />}
                onSelectAccount={onSelectRealSynthetic}
                onPasswordManager={openPasswordManager}
                onClickFund={onClickFundRealSynthetic}
                descriptor={localize('Trade CFDs on our Synthetic Indices that simulate real-world market movement.')}
                specs={real_synthetic_specs}
                is_logged_in={is_logged_in}
            />
            <MT5AccountCard
                has_mt5_account={has_mt5_account}
                is_disabled={!has_real_account}
                icon={() => <Icon icon='IcMt5FinancialPlatform' size={64} />}
                title={localize('Financial')}
                type={{
                    category: 'real',
                    type: 'financial',
                }}
                existing_data={current_list['real.financial']}
                commission_message={
                    <Localize
                        i18n_default_text='No commission <0>(excluding cryptocurrencies)</0>'
                        components={[<span key={0} className='mt5-dashboard--hint' />]}
                    />
                }
                onSelectAccount={onSelectRealFinancial}
                onPasswordManager={openPasswordManager}
                onClickFund={onClickFundRealFinancial}
                descriptor={localize(
                    'Trade commodities, cryptocurrencies, major (standard and micro-lots) and minor currency pairs with high leverage.'
                )}
                specs={real_financial_specs}
                is_logged_in={is_logged_in}
            />
            {((!is_logged_in && !is_eu_country) || (is_logged_in && !is_eu)) && (
                <MT5AccountCard
                    has_mt5_account={has_mt5_account}
                    icon={() => <Icon icon='IcMt5FinancialStpPlatform' size={64} />}
                    title={localize('Financial STP')}
                    type={{
                        category: 'real',
                        type: 'financial_stp',
                    }}
                    existing_data={current_list['real.financial_stp']}
                    commission_message={<Localize i18n_default_text='No commission' />}
                    onSelectAccount={onSelectRealFinancialStp}
                    button_label={button_label}
                    is_button_primary={is_pending_authentication}
                    onPasswordManager={openPasswordManager}
                    onClickFund={onClickFundRealFinancialStp}
                    descriptor={localize(
                        'Trade major, minor, and exotic currency pairs with Straight-Through Processing (STP) of your orders direct to the market.'
                    )}
                    specs={real_financial_stp_specs}
                    is_disabled={is_real_financial_stp_disabled}
                    is_logged_in={is_logged_in}
                />
            )}
        </div>
    );
};

export { MT5RealAccountDisplay };
