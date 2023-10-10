import React from 'react';
import { useMT5AccountsList } from '@deriv/api';
import DerivedMT5 from '../../../public/images/mt5-derived.svg';
import FinancialMT5 from '../../../public/images/mt5-financial.svg';
import SwapFreeMT5 from '../../../public/images/mt5-swap-free.svg';
import { PrimaryActionButton } from '../../PrimaryActionButton';
import { TradingAccountCard } from '../../TradingAccountCard';
import './AddedMT5AccountsList.scss';

const marketTypeToNameMapper = {
    all: 'Swap-Free',
    financial: 'Financial',
    synthetic: 'Derived',
};

const marketTypeToIconMapper = {
    all: <SwapFreeMT5 />,
    financial: <FinancialMT5 />,
    synthetic: <DerivedMT5 />,
};

type TProps = {
    account: NonNullable<ReturnType<typeof useMT5AccountsList>['data']>[number];
};

const AddedMT5AccountsList: React.FC<TProps> = ({ account }) => {
    return (
        <TradingAccountCard
            leading={() => (
                <div className='wallets-added-mt5__icon'>{marketTypeToIconMapper[account.market_type || 'all']}</div>
            )}
            trailing={() => (
                <div className='wallets-added-mt5__actions'>
                    <PrimaryActionButton className='wallets-added-mt5__transfer_button'>
                        <p className='wallets-added-mt5__transfer_text'>Transfer</p>
                    </PrimaryActionButton>
                    <PrimaryActionButton>
                        <p className='wallets-added-mt5__open_text'>Open</p>
                    </PrimaryActionButton>
                </div>
            )}
        >
            <div className='wallets-added-mt5__details'>
                <div className='wallets-added-mt5__details-title'>
                    <p className='wallets-added-mt5__details-title-text'>
                        {marketTypeToNameMapper[account.market_type || 'all']}
                    </p>
                    <div className='wallets-added-mt5__details-title-landing-company'>
                        <p className='wallets-added-mt5__details-title-landing-company-text'>
                            {account.landing_company_short}
                        </p>
                    </div>
                </div>
                <p className='wallets-added-mt5__details-balance'>
                    {account.display_balance} {account.currency}
                </p>
                <p className='wallets-added-mt5__details-loginid'>{account.display_login}</p>
            </div>
        </TradingAccountCard>
    );
};

export default AddedMT5AccountsList;
