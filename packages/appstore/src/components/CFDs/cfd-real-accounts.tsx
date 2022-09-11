import React from 'react';
import { Text, StaticUrl } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { CFD_PLATFORMS } from '@deriv/shared';
import CFDAccountManager from '../cfd-account-manager';
import AddDerived from 'Components/add-derived';
import { Button } from '@deriv/ui';

const available_real_accounts = [
    {
        name: 'Derived',
        description: localize('Trade CFDs on MT5 with Derived indices that simulate real-world market movements.'),
        has_account: false,
        disabled: true,
        platform: CFD_PLATFORMS.MT5,
        type: 'derived',
    },
    {
        name: 'Financial',
        description: localize('Trade CFDs on MT5 with forex, stocks & indices, commodities, and cryptocurrencies.'),
        has_account: false,
        disabled: true,
        platform: CFD_PLATFORMS.MT5,
        type: 'financial',
    },
    {
        name: 'Deriv X',
        description: localize(
            'Trade CFDs on Deriv X with Derived indices, forex, stocks & indices, commodities and cryptocurrencies.'
        ),
        has_account: false,
        disabled: true,
        platform: CFD_PLATFORMS.DXTRADE,
    },
];

const CFDRealAccounts = () => {
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
            {!has_cfd_account && (
                <div className='cfd-real-account__notification'>
                    <Text weight='bold'>
                        <Localize i18n_default_text={'You need an Options account to create a CFD account.'} />
                    </Text>
                    <Button>{localize('Get an Options account')}</Button>
                </div>
            )}
            <div className='cfd-real-account__accounts'>
                {available_real_accounts.map(account => (
                    <div className='cfd-real-account__accounts--item' key={account.name}>
                        <>
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
                            {account.type === 'derived' && (
                                <AddDerived
                                    title={localize('More Derived accounts')}
                                    onClickHandler={() => null}
                                    class_names='cfd-real-account__accounts--item__add-derived'
                                />
                            )}
                        </>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CFDRealAccounts;
