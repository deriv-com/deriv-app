import React from 'react';
import { observer } from 'mobx-react-lite';
import CFDDemoAccounts from './cfd-demo-accounts';
import CFDRealAccounts from './cfd-real-accounts';
import { isLandingCompanyEnabled, CFD_PLATFORMS } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { Loading, Text, StaticUrl } from '@deriv/components';
import { TPlatform, TAccountCategory, TMt5StatusServer, TMt5StatusServerType, TRootStore } from 'Types';
import { useStores } from 'Stores/index';
import { CompareAccountsModal } from '@deriv/cfd';

type TCFDAccountsProps = {
    account_type: TAccountCategory;
};

const CFDAccounts = ({ account_type }: TCFDAccountsProps) => {
    const store = useStores();
    const { client, modules }: TRootStore = store;
    const {
        is_eu,
        is_eu_country,
        landing_companies,
        is_logged_in,
        is_populating_mt5_account_list,
        is_populating_dxtrade_account_list,
        website_status,
        mt5_disabled_signup_types,
        dxtrade_disabled_signup_types,
        dxtrade_accounts_list_error,
        has_active_real_account,
        trading_platform_available_accounts,
    } = client;

    const { current_list, is_compare_accounts_visible, toggleCompareAccountsModal } = modules.cfd;
    const is_demo_tab = account_type === 'demo';

    const hasAccount = (platform: TPlatform, landing_company_short?: string) =>
        Object.keys(current_list).some(key =>
            landing_company_short
                ? key.startsWith(`${platform}.${account_type}`)
                : key.startsWith(`${platform}.${account_type}.${landing_company_short}`)
        );

    const isDerivedVisible = (platform: TPlatform) => {
        // Hiding card for logged out EU users
        if (!is_logged_in && is_eu_country) return false;

        if (is_eu && hasAccount(platform, 'synthetic')) return false;

        return isLandingCompanyEnabled({ landing_companies, platform, type: 'gaming' }) || !is_logged_in;
    };

    const isFinancialVisible = (platform: TPlatform) => {
        return (
            !is_logged_in ||
            isLandingCompanyEnabled({
                landing_companies,
                platform,
                type: 'financial',
            })
        );
    };

    const getIsSuspendedMt5Server = (type_server: TMt5StatusServer['demo' | 'real']) =>
        type_server?.map((item: TMt5StatusServerType) => item.all).some((item: number) => item === 1);

    const is_suspended_mt5_demo_server = getIsSuspendedMt5Server(website_status.mt5_status?.demo);
    const is_suspended_mt5_real_server = getIsSuspendedMt5Server(website_status.mt5_status?.real);

    const is_loading = is_populating_mt5_account_list || is_populating_dxtrade_account_list;

    if (is_loading) return <Loading className='cfd-accounts-container__loader' is_fullscreen={false} />;
    return (
        <div className='cfd-accounts-container'>
            <div className='cfd-demo-account__title'>
                <Text weight='bold' size='m'>
                    {localize('CFDs')}
                </Text>
                <div className='cfd-accounts-container__compare-accounts' onClick={toggleCompareAccountsModal}>
                    <Text weight='bold' size='xxs' color='red'>
                        <Localize i18n_default_text='Compare accounts' />
                    </Text>
                </div>
            </div>
            <div className='cfd-demo-account__description'>
                <Text>
                    <Localize
                        i18n_default_text={
                            'Trade with leverage and tight spreads for better returns on successful trades. <0>Learn more</0>'
                        }
                        components={[<StaticUrl key={0} className='link' href='/dmt5' />]}
                    />
                </Text>
            </div>
            {account_type === 'demo' && (
                <CFDDemoAccounts
                    isDerivedVisible={isDerivedVisible}
                    isFinancialVisible={isFinancialVisible}
                    has_cfd_account_error={platform => {
                        return platform === CFD_PLATFORMS.MT5
                            ? is_suspended_mt5_demo_server || mt5_disabled_signup_types.demo
                            : is_suspended_mt5_demo_server ||
                                  dxtrade_disabled_signup_types.demo ||
                                  !!dxtrade_accounts_list_error;
                    }}
                    current_list={current_list}
                    available_accounts={trading_platform_available_accounts}
                />
            )}
            {account_type === 'real' && (
                <CFDRealAccounts
                    isDerivedVisible={isDerivedVisible}
                    isFinancialVisible={isFinancialVisible}
                    has_real_account={has_active_real_account}
                    has_cfd_account_error={platform => {
                        return platform === CFD_PLATFORMS.MT5
                            ? is_suspended_mt5_real_server || mt5_disabled_signup_types.real
                            : is_suspended_mt5_real_server ||
                                  dxtrade_disabled_signup_types.real ||
                                  !!dxtrade_accounts_list_error;
                    }}
                    current_list={current_list}
                    available_accounts={trading_platform_available_accounts}
                />
            )}
            {is_compare_accounts_visible && (
                <CompareAccountsModal
                    context={store}
                    is_demo_tab={is_demo_tab}
                    // TODO: Will handle it in CFD flows
                    // openPasswordModal={openRealPasswordModal}
                    is_real_enabled={has_active_real_account}
                />
            )}
        </div>
    );
};

export default observer(CFDAccounts);
