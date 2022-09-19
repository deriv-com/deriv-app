import React from 'react';
import { Text, StaticUrl } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { CFD_PLATFORMS } from '@deriv/shared';
import CFDAccountManager from '../cfd-account-manager';
import { TCFDAccountsProps, TPlatform, TMarketType } from 'Types';
import { DetailsOfEachMT5Loginid } from '@deriv/api-types';

const CFDDemoAccounts = ({
    isDerivedVisible,
    isFinancialVisible,
    isDerivXVisible,
    current_list,
}: TCFDAccountsProps) => {
    const available_demo_accounts = [
        {
            name: 'Derived',
            description: localize('Trade CFDs on MT5 with Derived indices that simulate real-world market movements.'),
            is_visible: isDerivedVisible(CFD_PLATFORMS.MT5),
            disabled: false,
            platform: CFD_PLATFORMS.MT5,
            type: 'synthetic',
        },
        {
            name: 'Financial',
            description: localize('Trade CFDs on MT5 with forex, stocks & indices, commodities, and cryptocurrencies.'),
            is_visible: isFinancialVisible(CFD_PLATFORMS.MT5),
            disabled: false,
            platform: CFD_PLATFORMS.MT5,
            type: 'financial',
        },
        {
            name: 'Deriv X',
            is_visible: isDerivXVisible(CFD_PLATFORMS.DXTRADE),
            description: localize(
                'Trade CFDs on Deriv X with Derived indices, forex, stocks & indices, commodities and cryptocurrencies.'
            ),
            has_account: false,
            disabled: false,
            platform: CFD_PLATFORMS.DXTRADE,
        },
    ];

    const existing_demo_accounts = (platform: TPlatform, market_type?: TMarketType) => {
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

    return (
        <div className='cfd-demo-account'>
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
            <div className='cfd-demo-account__accounts'>
                {available_demo_accounts.map(account => (
                    <>
                        {existing_demo_accounts(account.platform, account.type) ? (
                            existing_demo_accounts(account.platform, account.type)?.map(existing_account => (
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

export default CFDDemoAccounts;
