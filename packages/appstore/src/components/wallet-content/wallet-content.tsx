import React from 'react';
import classNames from 'classnames';
import ContentDivider from './wallet-content-divider';
import { TCoreStores } from '@deriv/stores/types';
import WalletCfdsListing from './wallet-cfds-listing';
import WalletOptionsAndMultipliersListing from './wallet-option-multipliers-listing';
import EUDisclaimer from 'Components/eu-disclaimer';
import './wallet-content.scss';

type TProps = {
    is_demo: boolean;
    is_eu: boolean;
    account: TCoreStores['client']['accounts'][0];
};

const WalletContent = React.memo(({ is_demo, is_eu, account }: TProps) => {
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
            {is_eu && !is_demo && (
                <EUDisclaimer
                    is_wallet={true}
                    wrapperClassName='wallet-content__disclaimer'
                    textClassName='wallet-content__disclaimer-text'
                />
            )}
        </div>
    );
});
WalletContent.displayName = 'WalletContent';
export default WalletContent;
