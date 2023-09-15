import React from 'react';
import { Localize } from '@deriv/translations';
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
        description: 'Options and multipliers trading platform.',
        icon: <IcAppstoreDerivTrader />,
    },
    {
        title: 'Deriv Bot',
        description: 'Automate your trading, no coding needed.',
        icon: <IcAppstoreDerivBot />,
    },
    {
        title: 'SmartTrader',
        description: 'Our legacy options trading platform.',
        icon: <IcAppstoreSmartTrader />,
    },
    {
        title: 'Binary Bot',
        description: 'Our legacy automated trading platform.',
        icon: <IcAppstoreBinaryBot />,
    },
    {
        title: 'Deriv GO',
        description: 'Trade on the go with our mobile app.',
        icon: <IcAppstoreDerivGo />,
    },
];

const OptionsAndMultipliersListing = () => {
    return (
        <div className='wallets-options-and-multipliers-listing'>
            <section className='wallets-options-and-multipliers-listing__header'>
                <div className='wallets-options-and-multipliers-listing__header-title'>
                    <Localize i18n_default_text='Options & Multipliers' />
                </div>
                <div className='wallets-options-and-multipliers-listing__header-subtitle'>
                    <Localize
                        i18n_default_text='Earn a range of payouts by correctly predicting market price movements with <0>options</0>, or get the
                        upside of CFDs without risking more than your initial stake with <1>multipliers</1>.'
                        components={[
                            <a
                                key={0}
                                href='#'
                                className='wallets-options-and-multipliers-listing__header-subtitle__link'
                            />,
                            <a
                                key={1}
                                href='#'
                                className='wallets-options-and-multipliers-listing__header-subtitle__link'
                            />,
                        ]}
                    />
                </div>
            </section>
            <div className='wallets-options-and-multipliers-listing__content'>
                {options_and_multipliers.map(account => (
                    <TradingAccountCard {...account} key={`trading-account-card-${account.title}`} />
                ))}
            </div>
        </div>
    );
};

export default OptionsAndMultipliersListing;
