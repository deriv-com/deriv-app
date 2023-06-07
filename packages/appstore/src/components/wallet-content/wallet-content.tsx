import React from 'react';
import classNames from 'classnames';
import ContentDivider from './wallet-content-divider';
import WalletCfdsListing from './wallet-cfds-listing';
import WalletOptionsAndMultipliersListing from './wallet-option-multipliers-listing';
import EUDisclaimer from 'Components/eu-disclaimer';
import './wallet-content.scss';

type TProps = {
    is_demo: boolean;
    is_eu: boolean;
    wallet_account: React.ComponentProps<typeof WalletCfdsListing>['wallet_account'];
};

const WalletContent = React.memo(({ is_demo, is_eu, wallet_account }: TProps) => {
    return (
        <div
            className={classNames('wallet-content', {
                'wallet-content__demo': is_demo,
            })}
            data-testid='dt_wallet-content'
        >
            <ContentDivider is_demo_divider={is_demo} />
            <WalletCfdsListing wallet_account={wallet_account} />
            <ContentDivider />
            <WalletOptionsAndMultipliersListing wallet_account={wallet_account} />
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
