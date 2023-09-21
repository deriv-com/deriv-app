import React from 'react';
import { useCreateOtherCFDAccount } from '@deriv/api';
import CTrader from '../../../public/images/ctrader.svg';
import { SecondaryActionButton } from '../../SecondaryActionButton';
import { TradingAccountCard } from '../../TradingAccountCard';
import './AvailableCTraderAccountsList.scss';

const AvailableCTraderAccountsList: React.FC = () => {
    const { mutate } = useCreateOtherCFDAccount();

    const createcTraderAccount = () => {
        mutate({
            payload: {
                account_type: 'demo',
                platform: 'ctrader',
                market_type: 'synthetic',
            },
        });
    };

    return (
        <TradingAccountCard
            trailing={() => (
                <SecondaryActionButton onClick={createcTraderAccount}>
                    <p className='wallets-available__ctrader__text'>Get</p>
                </SecondaryActionButton>
            )}
            leading={() => (
                <div className='wallets-available__ctrader__content__icon'>
                    <CTrader />
                </div>
            )}
        >
            <div className='wallets-available__ctrader__content__details'>
                <p className='wallets-available__ctrader__content__details-title'>Deriv cTrader</p>
                <p className='wallets-available__ctrader__content__details-description'>
                    This account offers CFDs on a feature-rich trading platform.
                </p>
            </div>
        </TradingAccountCard>
    );
};

export default AvailableCTraderAccountsList;
