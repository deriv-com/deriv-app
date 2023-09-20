import React from 'react';
import classNames from 'classnames';
import ContentDivider from './wallet-content-divider';
import WalletCfdsListing from './wallet-cfds-listing';
import WalletOptionsAndMultipliersListing from './wallet-option-multipliers-listing';
import EUDisclaimer from 'Components/eu-disclaimer';
import './wallet-content.scss';

type TProps = {
    is_demo: boolean;
    is_malta_wallet: boolean;
};

const WalletContent = ({ is_demo, is_malta_wallet }: TProps) => {
    return (
        <div
            className={classNames('wallet-content', { 'wallet-content__demo': is_demo })}
            data-testid='dt_wallet-content'
        >
            <ContentDivider is_demo_divider={is_demo} />
            <WalletCfdsListing />
            <ContentDivider />
            <WalletOptionsAndMultipliersListing />
            {is_malta_wallet && !is_demo && (
                <EUDisclaimer
                    is_wallet
                    wrapperClassName='wallet-content__disclaimer'
                    textClassName='wallet-content__disclaimer-text'
                />
            )}
        </div>
    );
};

export default WalletContent;
