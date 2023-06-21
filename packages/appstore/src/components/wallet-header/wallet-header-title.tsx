import React from 'react';
import { Text, Badge } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { TWalletAccount } from 'Types';

type TWalletHeaderTitle = Pick<TWalletAccount, 'is_virtual' | 'currency' | 'landing_company_name'>;

const WalletHeaderTitle = React.memo(({ is_virtual, currency, landing_company_name }: TWalletHeaderTitle) => {
    const title = is_virtual ? (
        <Text weight='bold' size='sm' color='prominent'>
            <Localize
                i18n_default_text='Demo {{currency}} Wallet'
                values={{
                    currency,
                }}
            />
        </Text>
    ) : (
        <Text weight='bold' size='sm' color='prominent'>
            <Localize
                i18n_default_text='{{currency}} Wallet'
                values={{
                    currency,
                }}
            />
        </Text>
    );

    return (
        <div className='wallet-header__description-title'>
            {title}
            {!is_virtual && (
                <Badge
                    className='wallet-header__description-badge'
                    type='bordered'
                    label={landing_company_name?.toUpperCase()}
                />
            )}
        </div>
    );
});
WalletHeaderTitle.displayName = 'WalletHeaderTitle';
export default WalletHeaderTitle;
