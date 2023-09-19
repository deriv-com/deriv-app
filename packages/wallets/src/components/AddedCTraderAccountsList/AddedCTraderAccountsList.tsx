import React from 'react';
// import { useCtraderAccountsList } from '@deriv/api';
import CTrader from '../../public/images/ctrader.svg';
import { PrimaryActionButton } from '../PrimaryActionButton';
import { TradingAccountCard } from '../TradingAccountCard';
import './AddedCTraderAccountsList.scss';

const AddedCTraderAccountsList: React.FC = () => {
    // const { data } = useCtraderAccountsList();
    return (
        <TradingAccountCard
            leading={() => (
                <div className='wallets-added-ctrader__content__icon'>
                    <CTrader />
                </div>
            )}
            trailing={() => (
                <div className='wallets-added-ctrader__actions'>
                    <PrimaryActionButton className='wallets-added-ctrader__topup_button'>
                        <p className='wallets-added-ctrader__topup_text'>Top up</p>
                    </PrimaryActionButton>
                    <PrimaryActionButton>
                        <p className='wallets-added-ctrader__open_text'>Open</p>
                    </PrimaryActionButton>
                </div>
            )}
        >
            <div className='wallets-added-ctrader__content__details'>
                {/* {data?.map(account => (
                    <>
                        <p className='wallets-added-ctrader__details-title'>Deriv X</p>
                        <p className='wallets-added-ctrader__details-balance'>
                            {account?.display_balance} {account?.currency}
                        </p>
                        <p className='wallets-added-ctrader__details-loginid'>{account.login}</p>
                    </>
                ))} */}
            </div>
        </TradingAccountCard>
    );
};

export default AddedCTraderAccountsList;
