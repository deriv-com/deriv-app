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

const eu_currency_config = {
    EUR: 'Euro',
};

const eu_icon_config = {
    EUR: 'EUR',
};

const crypto_icon_config = {
    USD: 'USD',
    Bitcoin: 'BTC',
    Ethereum: 'ETH',
    Litecoin: 'LTC',
};

const crypto_config = {
    USD: 'US Dollar',
    Bitcoin: 'Bitcoin',
    Ethereum: 'Ethereum',
    Litecoin: 'Litecoin',
};

type TCryptoIcon = {
    currency: string;
    is_eu_user: boolean;
};

type TCryptoConfig = {
    currency: string;
    is_item_blurry?: boolean;
    is_eu_user: boolean;
};

const CryptoIcon = ({ currency, is_eu_user }: TCryptoIcon) => {
    const currency_icon_classname =
        currency === ('USD' && 'EUR') ? 'static-applauncher__icon--selected' : 'static-applauncher__icon--blurry';
    const currency_icon = is_eu_user ? eu_icon_config : crypto_icon_config;
    const icon_selector: keyof typeof crypto_icon_config & keyof typeof eu_icon_config =
        currency as keyof typeof crypto_icon_config & keyof typeof eu_icon_config;
    return (
        <Icon
            icon={`IcCurrency${currency_icon[icon_selector]}`}
            is_item_blurry
            size={38}
            className={currency_icon_classname}
        />
    );
};

const CurrencyIcon = ({ currency, is_item_blurry, is_eu_user }: TCryptoConfig) => {
    const loginid = is_eu_user ? localize('MF4581125') : localize('CR5236585');
    const currency_icon = is_eu_user ? eu_icon_config : crypto_icon_config;
    const currency_config = is_eu_user ? eu_currency_config : crypto_config;
    //infer the exact value of the keys it can return a union of their literal types instead of just returning "string".
    const icon_selector: keyof typeof crypto_icon_config & keyof typeof eu_icon_config =
        currency as keyof typeof crypto_icon_config & keyof typeof eu_icon_config;
    return (
        <React.Fragment>
            <Text size='xxs' weight='bold' color={is_item_blurry ? 'less-prominent' : 'prominent'}>
                {localize(`${currency_config[icon_selector]}`)}
            </Text>
            <Text size='xxxxs' color={is_item_blurry ? 'less-prominent' : 'prominent'}>
                {loginid}
            </Text>
            <Text
                size={is_eu_user ? 'xs' : 'xxxs'}
                weight='bold'
                color={is_item_blurry ? 'less-prominent' : 'prominent'}
            >{`${formatMoney(currency_icon[icon_selector], '0', true)} ${currency_icon[icon_selector]}`}</Text>
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
