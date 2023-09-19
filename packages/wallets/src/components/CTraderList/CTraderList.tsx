import React from 'react';
import CTrader from '../../public/images/ctrader.svg';
import { SecondaryActionButton } from '../SecondaryActionButton';
import { TradingAccountCard } from '../TradingAccountCard';
import './CTraderList.scss';

const ctrader_mapper = [
    {
        title: 'Deriv cTrader',
        description: 'This account offers CFDs on a feature-rich trading platform.',
        icon: <CTrader />,
    },
];

const CTraderList: React.FC = () => {
    return (
        <div className='wallets-ctrader'>
            <div className='wallets-ctrader__title'>
                <h1>Deriv cTrader</h1>
            </div>
            <div className='wallets-ctrader__content'>
                {ctrader_mapper.map(account => (
                    <TradingAccountCard
                        {...account}
                        key={`ctrader--${account.title}`}
                        trailing={() => (
                            <SecondaryActionButton>
                                <p className='wallets-ctrader__text'>Get</p>
                            </SecondaryActionButton>
                        )}
                        leading={() => <div className='wallets-ctrader__content__icon'>{account.icon}</div>}
                    >
                        <div className='wallets-ctrader__content__details'>
                            <p className='wallets-ctrader__content__details-title'>{account.title}</p>
                            <p className='wallets-ctrader__content__details-description'>{account.description}</p>
                        </div>
                    </TradingAccountCard>
                ))}
            </div>
        </div>
    );
};

export default CTraderList;
