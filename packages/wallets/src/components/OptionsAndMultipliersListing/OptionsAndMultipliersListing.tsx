import React from 'react';
import IcAppstoreBinaryBot from '../../public/images/ic-appstore-binary-bot.svg';
import IcAppstoreDerivBot from '../../public/images/ic-appstore-deriv-bot.svg';
import IcAppstoreDerivGo from '../../public/images/ic-appstore-deriv-go.svg';
import IcAppstoreDerivTrader from '../../public/images/ic-appstore-deriv-trader.svg';
import IcAppstoreSmartTrader from '../../public/images/ic-appstore-smart-trader.svg';
import { TradingAccountCard } from '..';
import './OptionsAndMultipliersListing.scss';

const options_and_multipliers = [
    {
        title: 'Deriv Trader',
        description: 'Options and multipliers trading platform',
        icon: <IcAppstoreDerivTrader />,
        has_divider: true,
    },
    {
        title: 'Deriv Bot',
        description: 'Automated trading, no coding required',
        icon: <IcAppstoreDerivBot />,
        has_divider: true,
    },
    {
        title: 'SmartTrader',
        description: 'Our legacy options trading platform',
        icon: <IcAppstoreSmartTrader />,
        has_divider: true,
    },
    {
        title: 'Binary Bot',
        description: 'Our legacy automated trading platform',
        icon: <IcAppstoreBinaryBot />,
    },
    {
        title: 'Deriv GO',
        description: 'Multipliers trading on the go',
        icon: <IcAppstoreDerivGo />,
    },
];

const OptionsAndMultipliersListing = () => {
    return (
        <div className='wallets-options-and-multipliers-listing'>
            <section className='wallets-options-and-multipliers-listing__header'>
                <div className='wallets-options-and-multipliers-listing__header-title'>
                    <h1>Options & multipliers</h1>
                </div>
                <div className='wallets-options-and-multipliers-listing__header-subtitle'>
                    <p>
                        Earn a range of payouts by correctly predicting market price movements with{' '}
                        <a href='#' className='wallets-options-and-multipliers-listing__header-subtitle__link'>
                            options
                        </a>{' '}
                        or get the upside of CFDs without risking more than your initial stake with{' '}
                        <a href='#' className='wallets-options-and-multipliers-listing__header-subtitle__link'>
                            multipliers
                        </a>
                        .
                    </p>
                </div>
            </section>
            <div className='wallets-options-and-multipliers-listing__content'>
                {options_and_multipliers.map(account => (
                    <TradingAccountCard {...account} key={account.title} />
                ))}
            </div>
        </div>
    );
};

export default OptionsAndMultipliersListing;
