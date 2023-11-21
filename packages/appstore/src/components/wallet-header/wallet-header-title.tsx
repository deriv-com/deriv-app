import React from 'react';
import { Text, Badge } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { TWalletAccount } from 'Types';

type TWalletHeaderTitle = Pick<TWalletAccount, 'is_demo' | 'currency' | 'landing_company_name'>;

const WalletHeaderTitle = ({ is_demo, currency, landing_company_name }: TWalletHeaderTitle) => {
    return (
        <div className='wallet-header__description-title'>
            <Text weight='bold' size='sm'>
                {is_demo ? (
                    <Localize i18n_default_text='Demo {{currency}} Wallet' values={{ currency }} />
                ) : (
                    <Localize i18n_default_text='{{currency}} Wallet' values={{ currency }} />
                )}
            </Text>
            {!is_demo && (
                <Badge
                    className='wallet-header__description-badge'
                    type='bordered'
                    label={landing_company_name?.toUpperCase()}
                />
            )}
        </div>
    );
};

export default WalletHeaderTitle;
