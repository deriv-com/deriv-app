import React from 'react';
import classNames from 'classnames';
import { TAccountCategory, TAccountStatus, TJurisdictionData, TWalletSvgCurrency } from 'Types';
// import OptionsAndMultipliersListing from 'Components/options-multipliers-listing';
// import CFDsListing from 'Components/cfds-listing';
import { isMobile } from '@deriv/shared';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import ContentDivider from './wallet-content-divider';
import WalletCFDsListing from 'Components/wallet-cfds-listing';
import WalletOptionsAndMultipliersListing from 'Components/wallet-options-multipliers-listing';
import './wallet-content.scss';

export type TWalletTestAccount = {
    account_status: TAccountStatus;
    balance: string;
    currency: TWalletSvgCurrency;
    shortcode: Extract<TJurisdictionData['jurisdiction'], 'svg' | 'malta'>;
    account_type: TAccountCategory;
};

type TWallet = {
    account: TWalletTestAccount;
    is_open_wallet?: boolean;
};

const WalletContent = React.memo(({ is_demo, is_eu = true }: any) => {
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
            <ContentDivider is_demo_divider={true} />
            <WalletCFDsListing />
            <ContentDivider />
            <WalletOptionsAndMultipliersListing />
            {is_eu && EUDisclaimer}
        </div>
    );
});
WalletContent.displayName = 'WalletContent';
export default WalletContent;
