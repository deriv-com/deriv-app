import React from 'react';
import { observer } from 'mobx-react-lite';
import { Text, StaticUrl } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { CFD_PLATFORMS } from '@deriv/shared';
import CFDAccountManager from '../cfd-account-manager';
import AddDerived from 'Components/add-derived';
import { TCFDAccountsProps, TPlatform, TMarketType } from 'Types';
import MissingRealAccount from 'Components/missing-real-acount';
import { useStores } from 'Stores/index';
import { DetailsOfEachMT5Loginid } from '@deriv/api-types';

const CFDRealAccounts = ({
    isDerivedVisible,
    isFinancialVisible,
    isDerivXVisible,
    is_eu,
    is_eu_country,
    is_logged_in,
    is_loading,
    has_cfd_account_error,
    current_list,
    is_virtual,
    isAccountOfTypeDisabled,
    has_real_account,
    standpoint,
    residence,
    should_enable_add_button,
}: TCFDAccountsProps) => {
    const available_real_accounts = [
        {
            name: 'Derived',
            description: localize('Trade CFDs on MT5 with Derived indices that simulate real-world market movements.'),
            is_visible: isDerivedVisible(CFD_PLATFORMS.MT5),
            disabled: has_cfd_account_error(CFD_PLATFORMS.MT5),
            platform: CFD_PLATFORMS.MT5,
            type: 'derived',
        },
        {
            name: 'Financial',
            description: localize('Trade CFDs on MT5 with forex, stocks & indices, commodities, and cryptocurrencies.'),
            is_visible: isFinancialVisible(CFD_PLATFORMS.MT5),
            disabled: has_cfd_account_error(CFD_PLATFORMS.MT5),
            platform: CFD_PLATFORMS.MT5,
            type: 'financial',
        },
        {
            name: 'Deriv X',
            description: localize(
                'Trade CFDs on Deriv X with Derived indices, forex, stocks & indices, commodities and cryptocurrencies.'
            ),
            is_visible: isDerivXVisible(CFD_PLATFORMS.DXTRADE),
            disabled: has_cfd_account_error(CFD_PLATFORMS.DXTRADE),
            platform: CFD_PLATFORMS.DXTRADE,
        },
    ];

    const existing_real_accounts = (platform: TPlatform, market_type?: TMarketType) => {
        const acc = Object.keys(current_list).some(key => key.startsWith(`${platform}.demo.${market_type}`))
            ? Object.keys(current_list)
                  .filter(key => key.startsWith(`${platform}.demo.${market_type}`))
                  .reduce((_acc, cur) => {
                      _acc.push(current_list[cur]);
                      return _acc;
                  }, [] as DetailsOfEachMT5Loginid[])
            : undefined;
        return acc;
    };

    const { client } = useStores();

    const has_cfd_account = available_real_accounts.find(account => account.has_account);
    return (
        <div className='cfd-real-account'>
            <div className='cfd-real-account__title'>
                <Text weight='bold' size='m'>
                    CFDs
                </Text>
                <Text weight='bold' size='xxs' color='red'>
                    <Localize i18n_default_text='Compare accounts' />
                </Text>
            </div>
            <div className='cfd-real-account__description'>
                <Text weight='bold'>
                    <Localize
                        i18n_default_text={
                            'Trade with leverage and tight spreads for better returns on successful trades. <0>Learn more</0>'
                        }
                        components={[<StaticUrl key={0} className='link' href='/dmt5' />]}
                    />
                </Text>
            </div>
            {!has_cfd_account && <MissingRealAccount onClickSignup={() => null} />}
            <div className='cfd-real-account__accounts'>
                {available_real_accounts.map(account => (
                    <>
                        {existing_real_accounts(account.platform, account.type) ? (
                            existing_real_accounts(account.platform, account.type)?.map(existing_account => (
                                <div className='cfd-demo-account__accounts--item' key={existing_account.login}>
                                    <CFDAccountManager
                                        has_account={true}
                                        type={account.type || ''}
                                        appname={account.name}
                                        platform={account.platform}
                                        disabled={false}
                                        loginid={existing_account.display_login}
                                        currency={existing_account.country}
                                        amount={existing_account.display_balance}
                                        onClickTopUp={() => null}
                                        onClickTrade={() => null}
                                        description={account.description}
                                    />
                                    {account.type === 'derived' && (
                                        <AddDerived
                                            title={localize('More Derived accounts')}
                                            onClickHandler={() => null}
                                            class_names='cfd-real-account__accounts--item__add-derived'
                                        />
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className='cfd-demo-account__accounts--item' key={account.name}>
                                <CFDAccountManager
                                    has_account={false}
                                    type={account.type || ''}
                                    appname={account.name}
                                    platform={account.platform}
                                    disabled={account.disabled}
                                    onClickGet={() => null}
                                    description={account.description}
                                />
                            </div>
                        )}
                    </>
                ))}
            </div>
        </div>
    );
};

export default observer(CFDRealAccounts);
