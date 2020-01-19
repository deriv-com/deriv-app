import React                  from 'react';
import { Icon }               from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import {
    real_advanced_specs,
    real_standard_specs,
    real_synthetic_specs }    from 'Modules/MT5/Constants/mt5-specifications';
import { MT5AccountCard }     from './mt5-account-card.jsx';

const getRealAdvancedButtonLabel = (is_fully_authenticated, is_pending_authentication) => {
    if (is_fully_authenticated) {
        return (
            <Localize
                i18n_default_text='Set your password'
            />
        );
    } else if (is_pending_authentication) {
        return (
            <Localize
                i18n_default_text='Pending verification'
            />
        );
    }

    return (
        <Localize
            i18n_default_text='Create account'
        />
    );
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
}) => {
    const button_label              = getRealAdvancedButtonLabel(is_fully_authenticated, is_pending_authentication);
    const is_real_advanced_disabled = !has_real_account || is_pending_authentication;

    const onSelectRealAdvanced  = () => {
        const account_type = {
            category: 'real',
            type    : 'advanced',
        };
        if (is_fully_authenticated) {
            openPasswordModal(account_type);
        } else if (!is_fully_authenticated && !is_real_advanced_disabled) {
            onSelectAccount(account_type);
        }
    };
    const onSelectRealStandard  = () => onSelectAccount({ type: 'standard', category: 'real' });
    const onSelectRealSynthetic = () => onSelectAccount({ type: 'synthetic_indices', category: 'real' });

    const onClickFundRealAdvanced  = () => openAccountTransfer(current_list['real.advanced'], {
        category: 'real',
        type    : 'advanced',
    });
    const onClickFundRealSynthetic = () => openAccountTransfer(current_list['real.synthetic_indices'], {
        category: 'real',
        type    : 'synthetic_indices',
    });
    const onClickFundRealStandard  = () => openAccountTransfer(current_list['real.standard'], {
        category: 'real',
        type    : 'standard',
    });

    return (
        <div className='mt5-real-accounts-display'>
            <MT5AccountCard
                has_mt5_account={has_mt5_account}
                is_disabled={!has_real_account}
                icon={() => (<Icon icon='IcMt5Standard' size={64} />)}
                title={localize('Standard')}
                type={{
                    category: 'real',
                    type    : 'standard',
                }}
                existing_data={current_list['real.standard']}
                commission_message={
                    <Localize
                        i18n_default_text='No commission <0>(excluding cryptocurrencies)</0>'
                        components={[<span key={0} className='mt5-dashboard--hint' />]}
                    />
                }
                onSelectAccount={onSelectRealStandard}
                onPasswordManager={openPasswordManager}
                onClickFund={onClickFundRealStandard}
                descriptor={localize('Suitable for both new and experienced traders.')}
                specs={real_standard_specs}
            />
            <MT5AccountCard
                has_mt5_account={has_mt5_account}
                icon={() => (<Icon icon='IcMt5Advanced' size={64} />)}
                title={localize('Advanced')}
                type={{
                    category: 'real',
                    type    : 'advanced',
                }}
                existing_data={current_list['real.advanced']}
                commission_message={<Localize i18n_default_text='No commission' />}
                onSelectAccount={onSelectRealAdvanced}
                button_label={button_label}
                onPasswordManager={openPasswordManager}
                onClickFund={onClickFundRealAdvanced}
                descriptor={localize('Give you more products, tight spreads, and higher ticket size.')}
                specs={real_advanced_specs}
                is_disabled={is_real_advanced_disabled}
            />
            <MT5AccountCard
                has_mt5_account={has_mt5_account}
                icon={() => (<Icon icon='IcMt5SyntheticIndices' size={64} />)}
                title={localize('Synthetic Indices')}
                is_disabled={!has_real_account}
                type={{
                    category: 'real',
                    type    : 'synthetic_indices',
                }}
                existing_data={current_list['real.synthetic_indices']}
                commission_message={<Localize i18n_default_text='No commission' />}
                onSelectAccount={onSelectRealSynthetic}
                onPasswordManager={openPasswordManager}
                onClickFund={onClickFundRealSynthetic}
                descriptor={localize('Trade CFDs on our Synthetic Indices that simulate real-world market movement.')}
                specs={real_synthetic_specs}
            />
        </div>
    );
};

export { MT5RealAccountDisplay };
