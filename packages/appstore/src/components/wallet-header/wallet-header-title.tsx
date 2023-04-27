import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

type TWalletHeaderTitle = {
    is_demo: boolean;
    currency: 'USD' | 'EUR' | 'AUD' | 'BTC' | 'ETH' | 'USDT' | 'eUSDT' | 'tUSDT' | 'LTC' | 'USDC';
    jurisdiction: 'svg' | 'malta';
};

const WalletHeaderTitle = React.memo(({ is_demo, currency, jurisdiction }: TWalletHeaderTitle) => {
    const title_size = 'sm';
    const badge_size = 'xxxs';
    const badge_lh_size = 'xxxs';

    const title_text = `<0>${is_demo ? `Demo ${currency}` : currency} Wallet</0>`;
    const badge_text = `<0>${jurisdiction.toUpperCase()}</0>`;

    return (
        <div className='wallet-header__description-title'>
            <Localize i18n_default_text={title_text} components={[<Text key={0} weight='bold' size={title_size} />]} />
            {!is_demo && (
                <Localize
                    i18n_default_text={badge_text}
                    components={[
                        <Text
                            key={0}
                            weight='bold'
                            size={badge_size}
                            line_height={badge_lh_size}
                            className='wallet-header__description-badge'
                        />,
                    ]}
                />
            )}
        </div>
    );
});
WalletHeaderTitle.displayName = 'WalletHeaderTitle';
export default WalletHeaderTitle;
