import React from 'react';
import classNames from 'classnames';
import ContentDivider from './wallet-content-divider';
import WalletCfdsListing from './wallet-cfds-listing';
import { TWalletAccount } from 'Types';
import WalletOptionsAndMultipliersListing from './wallet-option-multipliers-listing';
import EUDisclaimer from 'Components/eu-disclaimer';
import './wallet-content.scss';

type TProps = {
    data: TWalletAccount;
};

const WalletContent = ({ data }: TProps) => {
    const is_eu = data.landing_company_name === 'malta';

    return (
        <div
            className={classNames('wallet-content', { 'wallet-content__demo': data.is_demo })}
            data-testid='dt_wallet-content'
        >
            <ContentDivider is_demo_divider={data.is_demo} />
            <WalletCfdsListing wallet_account={data} />
            <ContentDivider />
            <WalletOptionsAndMultipliersListing wallet_account={data} />
            {is_eu && !data.is_demo && (
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
