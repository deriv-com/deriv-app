import React from 'react';
import { observer } from 'mobx-react-lite';
import CFDDemoAccounts from './cfd-demo-accounts';
import CFDRealAccounts from './cfd-real-accounts';
import { isLandingCompanyEnabled, CFD_PLATFORMS } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { Loading, Text, StaticUrl } from '@deriv/components';
import { TPlatform, TAccountCategory, TMt5StatusServer, TMt5StatusServerType } from 'Types';
import { useStores } from 'Stores/index';

type TCFDAccountsProps = {
    account_type: TAccountCategory;
};

const CFDAccounts = ({ account_type }: TCFDAccountsProps) => {
    const { client, cfd_account } = useStores();
    const {
        is_eu,
        is_eu_country,
        landing_companies,
        is_logged_in,
        is_populating_mt5_account_list: is_loading,
        website_status,
        mt5_disabled_signup_types,
        dxtrade_disabled_signup_types,
        dxtrade_accounts_list_error,
        is_virtual,
        isAccountOfTypeDisabled,
        has_active_real_account: has_real_account,
        standpoint,
        residence,
        upgradeable_landing_companies,
    } = client;
    const { current_list } = cfd_account;

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

    const isDerivXVisible = (platform: TPlatform) => {
        return (
            !is_logged_in ||
            isLandingCompanyEnabled({
                landing_companies,
                platform,
                type: 'financial',
            }) ||
            isLandingCompanyEnabled({
                landing_companies,
                platform,
                type: 'gaming',
            })
        );
    };

    const getIsSuspendedMt5Server = (type_server: TMt5StatusServer['demo' | 'real']) =>
        type_server?.map((item: TMt5StatusServerType) => item.all).some((item: number) => item === 1);

    const is_suspended_mt5_demo_server = getIsSuspendedMt5Server(website_status.mt5_status?.demo);
    const is_suspended_mt5_real_server = getIsSuspendedMt5Server(website_status.mt5_status?.real);

    const should_show_missing_real_account =
        is_logged_in && !has_real_account && upgradeable_landing_companies?.length > 0;
    const should_enable_add_button = should_show_missing_real_account && CFD_PLATFORMS.MT5 && account_type === 'real';

    if (is_loading) return <Loading className='cfd-accounts-container__loader' />;
    return (
        <div className='cfd-accounts-container'>
            <div className='cfd-demo-account__title'>
                <Text weight='bold' size='m'>
                    CFDs
                </Text>
                <Text weight='bold' size='xxs' color='red'>
                    <Localize i18n_default_text='Compare accounts' />
                </Text>
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
                    isDerivXVisible={isDerivXVisible}
                    is_eu={is_eu}
                    is_eu_country={is_eu_country}
                    is_logged_in={is_logged_in}
                    is_loading={is_loading}
                    has_cfd_account_error={platform => {
                        return platform === CFD_PLATFORMS.MT5
                            ? is_suspended_mt5_demo_server || mt5_disabled_signup_types.demo
                            : is_suspended_mt5_demo_server ||
                                  dxtrade_disabled_signup_types.demo ||
                                  !!dxtrade_accounts_list_error;
                    }}
                    current_list={current_list}
                    is_virtual={is_virtual}
                    isAccountOfTypeDisabled={isAccountOfTypeDisabled}
                    has_real_account={has_real_account}
                    standpoint={standpoint}
                    residence={residence}
                    should_enable_add_button={should_enable_add_button}
                />
            )}
            {account_type === 'real' && (
                <CFDRealAccounts
                    isDerivedVisible={isDerivedVisible}
                    isFinancialVisible={isFinancialVisible}
                    isDerivXVisible={isDerivXVisible}
                    is_eu={is_eu}
                    is_eu_country={is_eu_country}
                    is_logged_in={is_logged_in}
                    is_loading={is_loading}
                    has_cfd_account_error={platform => {
                        return platform === CFD_PLATFORMS.MT5
                            ? is_suspended_mt5_real_server || mt5_disabled_signup_types.real
                            : is_suspended_mt5_real_server ||
                                  dxtrade_disabled_signup_types.real ||
                                  !!dxtrade_accounts_list_error;
                    }}
                    current_list={current_list}
                    is_virtual={is_virtual}
                    isAccountOfTypeDisabled={isAccountOfTypeDisabled}
                    has_real_account={has_real_account}
                    standpoint={standpoint}
                    residence={residence}
                    should_enable_add_button={should_enable_add_button}
                />
            )}
        </div>
    );
};

export default observer(CFDAccounts);
