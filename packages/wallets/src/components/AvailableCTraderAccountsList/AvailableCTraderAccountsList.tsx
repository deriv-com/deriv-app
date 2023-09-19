import React from 'react';
import CTrader from '../../public/images/ctrader.svg';
import { SecondaryActionButton } from '../SecondaryActionButton';
import { TradingAccountCard } from '../TradingAccountCard';
import './AvailableCTraderAccountsList.scss';

const AvailableCTraderAccountsList: React.FC = () => {
    return (
        <TradingAccountCard
            trailing={() => (
                <SecondaryActionButton>
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
