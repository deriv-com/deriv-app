import React from 'react';
import { Icon, Text } from '@deriv/components';
import { formatMoney } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import './wallet-account.scss';

type TWalletAccount = {
    balance: number;
    currency: string;
    name: string;
    icon: string;
    is_mobile?: boolean;
};

const WalletAccount = ({ balance, name, currency, icon, is_mobile = false }: TWalletAccount) => {
    return (
        <div className='wallet-account'>
            <Icon className='wallet-account__icon' icon={icon} size={24} />
            <div className='wallet-account__details'>
                <Text as='div' color='prominent' size={is_mobile ? 'xxs' : 'xs'} weight='bold'>
                    {name}
                </Text>

                <Text as='div' size={is_mobile ? 'xxxs' : 'xxs'}>
                    <Localize
                        i18n_default_text='Balance: {{balance}} {{currency}}'
                        values={{ balance: formatMoney(currency ?? '', balance, true), currency }}
                    />
                </Text>
            </div>
        </div>
    );
};

export default WalletAccount;
