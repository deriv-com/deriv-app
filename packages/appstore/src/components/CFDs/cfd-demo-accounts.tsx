import React from 'react';
import { Text, StaticUrl } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { CFD_PLATFORMS } from '@deriv/shared';
import CFDAccountManager from '../cfd-account-manager';

const available_demo_accounts = [
    {
        name: 'Derived',
        description: localize('Trade CFDs on MT5 with Derived indices that simulate real-world market movements.'),
        has_account: false,
        disabled: false,
        platform: CFD_PLATFORMS.MT5,
        type: 'derived',
    },
    {
        name: 'Financial',
        description: localize('Trade CFDs on MT5 with forex, stocks & indices, commodities, and cryptocurrencies.'),
        has_account: false,
        disabled: false,
        platform: CFD_PLATFORMS.MT5,
        type: 'financial',
    },
    {
        name: 'Deriv X',
        description: localize(
            'Trade CFDs on Deriv X with Derived indices, forex, stocks & indices, commodities and cryptocurrencies.'
        ),
        has_account: false,
        disabled: false,
        platform: CFD_PLATFORMS.DXTRADE,
    },
];

const CFDDemoAccounts = () => {
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
                ))}
            </div>
        </div>
    );
};

export default CFDDemoAccounts;
