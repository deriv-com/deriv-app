import React from 'react';
import { Text, Badge } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { TJurisdictionData, TWalletCurrency } from 'Types';

type TWalletHeaderTitle = {
    is_demo: boolean;
    currency: TWalletCurrency;
    shortcode: Exclude<TJurisdictionData['jurisdiction'], undefined>;
};

const WalletHeaderTitle = React.memo(({ is_demo, currency, shortcode }: TWalletHeaderTitle) => {
    const title = is_demo ? (
        <Text weight='bold' size='sm'>
            <Localize
                i18n_default_text='Demo {{currency}} Wallet'
                values={{
                    currency,
                }}
            />
        </Text>
    ) : (
        <Text weight='bold' size='sm'>
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
            {!is_demo && (
                <Badge className='wallet-header__description-badge' type='bordered' label={shortcode.toUpperCase()} />
            )}
        </div>
    );
});
WalletHeaderTitle.displayName = 'WalletHeaderTitle';
export default WalletHeaderTitle;
