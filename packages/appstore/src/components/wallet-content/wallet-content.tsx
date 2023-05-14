import React from 'react';
import classNames from 'classnames';
import ContentDivider from './wallet-content-divider';
import { isMobile } from '@deriv/shared';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { TCoreStores } from '@deriv/stores/types';
import WalletCfdsListing from './wallet-cfds-listing';
import WalletOptionsAndMultipliersListing from './wallet-option-multipliers-listing';
import './wallet-content.scss';

type TProps = {
    is_demo: boolean;
    is_eu: boolean;
    account: TCoreStores['client']['accounts'][0];
};

const WalletContent = React.memo(({ is_demo, is_eu, account }: TProps) => {
    const EUDisclaimer = (
        <div className='wallet-content__disclaimer'>
            <Text align='left' className='wallet-content__disclaimer-text' size={isMobile() ? 'xxxs' : 'xs'}>
                <Localize
                    i18n_default_text='CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. <0>73% of retail investor accounts lose money when trading CFDs with this provider</0>. You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money.'
                    components={[<strong key={0} />]}
                />
            </Text>
        </div>
    );

    return (
        <div
            className={classNames('wallet-content', {
                'wallet-content__demo': is_demo,
            })}
        >
            <ContentDivider is_demo_divider={is_demo} />
            <WalletCfdsListing account={account} />
            <ContentDivider />
            <WalletOptionsAndMultipliersListing account={account} />
            {is_eu && !is_demo && EUDisclaimer}
        </div>
    );
});
WalletContent.displayName = 'WalletContent';
export default WalletContent;
