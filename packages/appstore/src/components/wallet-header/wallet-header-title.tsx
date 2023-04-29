import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { TWalletSvgCurrency } from 'Types';

type TWalletHeaderTitle = {
    is_demo: boolean;
    currency: TWalletSvgCurrency;
    jurisdiction: 'svg' | 'malta';
};

const WalletHeaderTitle = React.memo(({ is_demo, currency, jurisdiction }: TWalletHeaderTitle) => {
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

    const badge = (
        <Text weight='bold' size='xxxs' line_height='xxxs' className='wallet-header__description-badge'>
            <Localize
                i18n_default_text='{{jurisdiction}}'
                values={{
                    jurisdiction: jurisdiction.toUpperCase(),
                }}
            />
        </Text>
    );

    return (
        <div className='wallet-header__description-title'>
            {title}
            {!is_demo && badge}
        </div>
    );
});
WalletHeaderTitle.displayName = 'WalletHeaderTitle';
export default WalletHeaderTitle;
