import React from 'react';
import { Text, StaticUrl } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { CFD_PLATFORMS } from '@deriv/shared';
import CFDAccountManager from '../cfd-account-manager';
import { TCFDAccounts } from 'Types';

const CFDDemoAccounts = ({ isDerivedVisible, isFinancialVisible, isDerivXVisible, hasAccount }: TCFDAccounts) => {
    // console.log('loading1', is_populating_mt5_account_list)

    const available_demo_accounts = [
        {
            name: 'Derived',
            description: localize('Trade CFDs on MT5 with Derived indices that simulate real-world market movements.'),
            is_visible: isDerivedVisible(CFD_PLATFORMS.MT5),
            has_account: hasAccount(CFD_PLATFORMS.MT5, 'synthetic'),
            disabled: false,
            platform: CFD_PLATFORMS.MT5,
            type: 'derived',
        },
        {
            name: 'Financial',
            description: localize('Trade CFDs on MT5 with forex, stocks & indices, commodities, and cryptocurrencies.'),
            is_visible: isFinancialVisible(CFD_PLATFORMS.MT5),
            has_account: hasAccount(CFD_PLATFORMS.MT5, 'financial'),
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
                {available_demo_accounts.map(
                    account =>
                        account.is_visible && (
                            <div className='cfd-demo-account__accounts--item' key={account.name}>
                                <CFDAccountManager
                                    has_account={account.has_account}
                                    type={account.type || ''}
                                    appname={account.name}
                                    platform={account.platform}
                                    disabled={account.disabled}
                                    loginid='123'
                                    currency='USD'
                                    amount='10,000'
                                    onClickTopUp={() => null}
                                    onClickTrade={() => null}
                                    onClickGet={() => null}
                                    description={account.description}
                                />
                            </div>
                        )
                )}
            </div>
        </div>
    );
};

export default CFDDemoAccounts;
