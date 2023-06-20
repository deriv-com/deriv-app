import React from 'react';
import classNames from 'classnames';
import ContentDivider from './wallet-content-divider';
import WalletCfdsListing from './wallet-cfds-listing';
import { TWalletAccount } from 'Types';
import WalletOptionsAndMultipliersListing from './wallet-option-multipliers-listing';
import EUDisclaimer from 'Components/eu-disclaimer';
import './wallet-content.scss';

type TProps = {
    wallet_account: TWalletAccount;
};

const WalletContent = ({ wallet_account }: TProps) => {
    const is_eu = wallet_account.landing_company_name === 'malta';

    return (
        <div
            className={classNames('wallet-content', { 'wallet-content__demo': wallet_account.is_demo })}
            data-testid='dt_wallet-content'
        >
            <ContentDivider is_demo_divider={wallet_account.is_demo} />
            <WalletCfdsListing wallet_account={wallet_account} />
            <ContentDivider />
            <WalletOptionsAndMultipliersListing wallet_account={wallet_account} />
            {is_eu && !wallet_account.is_demo && (
                <EUDisclaimer
                    is_wallet={true}
                    wrapperClassName='wallet-content__disclaimer'
                    textClassName='wallet-content__disclaimer-text'
                />
            )}
        </div>
    );
};

export default WalletContent;
