import React from 'react';
import { useMT5AccountsList } from '@deriv/api';
import DerivedMT5 from '../../../public/images/mt5-derived.svg';
import FinancialMT5 from '../../../public/images/mt5-financial.svg';
import SwapFreeMT5 from '../../../public/images/mt5-swap-free.svg';
import { PrimaryActionButton } from '../../PrimaryActionButton';
import { TradingAccountCard } from '../../TradingAccountCard';
import './AddedMT5AccountsList.scss';

const market_type_to_name_mapper = {
    all: 'Swap-Free',
    financial: 'Financial',
    synthetic: 'Derived',
};

const market_type_to_icon_mapper = {
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
                <div className='wallets-added-mt5__icon'>
                    {market_type_to_icon_mapper[account.market_type || 'all']}
                </div>
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
                <p className='wallets-added-mt5__details-title'>
                    {market_type_to_name_mapper[account.market_type || 'all']}
                </p>
                <p className='wallets-added-mt5__details-balance'>
                    {account.display_balance} {account.currency}
                </p>
                <p className='wallets-added-mt5__details-loginid'>{account.display_login}</p>
            </div>
        </TradingAccountCard>
    );
};

export default AddedMT5AccountsList;
