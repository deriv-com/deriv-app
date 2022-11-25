import React from 'react';
import classNames from 'classnames';
import { Icon, Button, Text } from '@deriv/components';
import { formatMoney } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';

import './static-applauncher.scss';

type TStaticAppLauncher = {
    icon_type: 'USD' | 'EUR' | 'Bitcoin' | 'Ethereum' | 'Litecoin';
    is_item_blurry?: boolean;
    is_grey?: boolean;
    is_eu_user: boolean;
};

const crypto_icon_config = {
    USD: 'USD',
    EUR: 'EUR',
    Bitcoin: 'BTC',
    Ethereum: 'ETH',
    Litecoin: 'LTC',
};

const crypto_config = {
    USD: 'US Dollar',
    EUR: 'Euro',
    Bitcoin: 'Bitcoin',
    Ethereum: 'Ethereum',
    Litecoin: 'Litecoin',
};

type TCryptoIcon = {
    currency: keyof typeof crypto_icon_config;
    is_eu_user: boolean;
};

type TCryptoConfig = {
    currency: keyof typeof crypto_config;
    is_item_blurry?: boolean;
    is_eu_user: boolean;
};

const CryptoIcon = ({ currency }: TCryptoIcon) => {
    const currency_icon_classname =
        currency === ('USD' && 'EUR') ? 'static-applauncher__icon--selected' : 'static-applauncher__icon--blurry';
    return (
        <Icon
            icon={`IcCurrency${crypto_icon_config[currency]}`}
            is_item_blurry
            size={38}
            className={currency_icon_classname}
        />
    );
};

const CurrencyIcon = ({ currency, is_item_blurry, is_eu_user }: TCryptoConfig) => {
    const is_eu_loginid = is_eu_user ? localize('MF4581125') : localize('CR5236585');
    return (
        <React.Fragment>
            <Text size='xxs' weight='bold' color={is_item_blurry ? 'less-prominent' : 'prominent'}>
                {localize(`${crypto_config[currency]}`)}
            </Text>
            <Text size='xxxxs' color={is_item_blurry ? 'less-prominent' : 'prominent'}>
                {is_eu_loginid}
            </Text>
            <Text
                size={is_eu_user ? 'xs' : 'xxxs'}
                weight='bold'
                color={is_item_blurry ? 'less-prominent' : 'prominent'}
            >{`${formatMoney(crypto_icon_config[currency], '0', true)} ${crypto_icon_config[currency]}`}</Text>
        </React.Fragment>
    );
};

const StaticAppLauncher = ({ icon_type, is_item_blurry, is_grey, is_eu_user }: TStaticAppLauncher) => {
    return (
        <div
            className={classNames('static-applauncher', {
                'static-applauncher--grey': is_grey,
            })}
        >
            <div className='static-applauncher__icon'>
                <CryptoIcon currency={icon_type} is_eu_user={is_eu_user} />
            </div>
            <div className='static-applauncher__details'>
                <CurrencyIcon is_item_blurry={is_item_blurry} currency={icon_type} is_eu_user={is_eu_user} />
            </div>
            <div className='static-applauncher__buttons'>
                <Button secondary small className='static-applauncher__buttons-topup'>
                    <Localize i18n_default_text='Deposit' />
                </Button>
            </div>
        </div>
    );
    //
};

export default StaticAppLauncher;
