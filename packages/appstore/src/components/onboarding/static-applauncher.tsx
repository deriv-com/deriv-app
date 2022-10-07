import React from 'react';
import classNames from 'classnames';
import { Icon, Button, Text } from '@deriv/components';
import { formatMoney } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';

import './static-applauncher.scss';

type TStaticAppLauncher = {
    icon_type: 'USD' | 'Bitcoin' | 'Ethereum' | 'Litecoin';
    is_item_blurry?: boolean;
    is_grey?: boolean;
};

const StaticAppLauncher = ({ icon_type, is_item_blurry, is_grey }: TStaticAppLauncher) => {
    return (
        <div
            className={classNames('static-applauncher', {
                'static-applauncher--grey': is_grey,
            })}
        >
            <div className='static-applauncher__icon'>
                {icon_type === 'USD' && <Icon icon='IcCurrencyUsd' is_item_blurry size={38} />}
                {icon_type === 'Bitcoin' && (
                    <Icon
                        icon='IcCurrencyBtc'
                        is_item_blurry
                        size={38}
                        className={'static-applauncher__icon--blurry'}
                    />
                )}
                {icon_type === 'Ethereum' && (
                    <Icon
                        icon='IcCurrencyEth'
                        is_item_blurry
                        size={38}
                        className={'static-applauncher__icon--blurry'}
                    />
                )}
                {icon_type === 'Litecoin' && (
                    <Icon
                        icon='IcCurrencyLtc'
                        is_item_blurry
                        size={38}
                        className={'static-applauncher__icon--blurry'}
                    />
                )}
            </div>
            <div className='static-applauncher__details'>
                {icon_type === 'USD' && (
                    <>
                        <Text size='xxs' weight='bold' color={is_item_blurry ? 'less-prominent' : 'prominent'}>
                            {localize('US Dollar')}
                        </Text>
                        <Text size='xxxs' color={is_item_blurry ? 'less-prominent' : 'prominent'}>
                            {localize('CR5236585')}
                        </Text>
                        <Text size='xxs' color={is_item_blurry ? 'less-prominent' : 'prominent'}>{`${formatMoney(
                            'USD',
                            '0',
                            true
                        )} USD`}</Text>
                    </>
                )}
                {icon_type === 'Bitcoin' && (
                    <>
                        <Text size='xxs' weight='bold' color={is_item_blurry ? 'less-prominent' : 'prominent'}>
                            {localize('Bitcoin')}
                        </Text>
                        <Text size='xxxs' color={is_item_blurry ? 'less-prominent' : 'prominent'}>
                            {localize('CR5236585')}
                        </Text>
                        <Text size='xxs' color={is_item_blurry ? 'less-prominent' : 'prominent'}>{`${formatMoney(
                            'BTC',
                            '0',
                            true
                        )} BTC`}</Text>
                    </>
                )}
                {icon_type === 'Ethereum' && (
                    <>
                        <Text size='xxs' weight='bold' color={is_item_blurry ? 'less-prominent' : 'prominent'}>
                            {localize('Ethereum')}
                        </Text>
                        <Text size='xxxs' color={is_item_blurry ? 'less-prominent' : 'prominent'}>
                            {localize('CR5236585')}
                        </Text>
                        <Text size='xxs' color={is_item_blurry ? 'less-prominent' : 'prominent'}>{`${formatMoney(
                            'ETH',
                            '0',
                            true
                        )} ETH`}</Text>
                    </>
                )}
                {icon_type === 'Litecoin' && (
                    <>
                        <Text size='xxs' weight='bold' color={is_item_blurry ? 'less-prominent' : 'prominent'}>
                            {localize('Litecoin')}
                        </Text>
                        <Text size='xxxs' color={is_item_blurry ? 'less-prominent' : 'prominent'}>
                            {localize('CR5236585')}
                        </Text>
                        <Text size='xxs' color={is_item_blurry ? 'less-prominent' : 'prominent'}>{`${formatMoney(
                            'LTC',
                            '0',
                            true
                        )} LTC`}</Text>
                    </>
                )}
            </div>
            <div className='static-applauncher__buttons'>
                <Button secondary small className='static-applauncher__buttons-topup'>
                    <Localize i18n_default_text='deposit' />
                </Button>
            </div>
        </div>
    );
    //
};

export default StaticAppLauncher;
