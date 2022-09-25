import React from 'react';
import { Icon, Button, Text } from '@deriv/components';
import { formatMoney } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';

import './static-cfd-account-manager.scss';

type TStaticAppLauncher = {
    icon_type: 'USD' | 'Bitcoin' | 'Ethereum' | 'Litecoin';
    is_item_blurry?: boolean;
};

const StaticAppLauncher = ({ icon_type, is_item_blurry }: TStaticAppLauncher) => {
    return (
        <div className='static-cfd-account-manager'>
            <div className='static-cfd-account-manager__icon'>
                {icon_type === 'USD' && <Icon icon='IcCurrencyUsd' is_item_blurry size={38} />}
                {icon_type === 'Bitcoin' && (
                    <Icon
                        icon='IcCurrencyBtc'
                        is_item_blurry
                        size={38}
                        className={'static-cfd-account-manager__icon--blurry'}
                    />
                )}
                {icon_type === 'Ethereum' && (
                    <Icon
                        icon='IcCurrencyEth'
                        is_item_blurry
                        size={38}
                        className={'static-cfd-account-manager__icon--blurry'}
                    />
                )}
                {icon_type === 'Litecoin' && (
                    <Icon
                        icon='IcCurrencyLtc'
                        is_item_blurry
                        size={38}
                        className={'static-cfd-account-manager__icon--blurry'}
                    />
                )}
            </div>
            <div className='static-cfd-account-manager__details'>
                <Text size='xs' weight='bold' color={is_item_blurry ? 'less-prominent' : 'prominent'}>
                    {localize('US Dollar')}
                </Text>
                <Text size='xs' color={is_item_blurry ? 'less-prominent' : 'prominent'}>
                    {localize('CR5236585')}
                </Text>
                <Text size='xs' color={is_item_blurry ? 'less-prominent' : 'prominent'}>{`${formatMoney(
                    'USD',
                    '0',
                    true
                )} USD`}</Text>
            </div>
            <div className='static-cfd-account-manager__buttons'>
                <Button secondary small className='static-cfd-account-manager__buttons-topup'>
                    <Localize i18n_default_text='deposit' />
                </Button>
            </div>
        </div>
    );
};

export default StaticAppLauncher;
