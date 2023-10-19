import React from 'react';
import { useHistory } from 'react-router-dom';
import useDevice from '../../hooks/useDevice';
import IcAppstoreBinaryBot from '../../public/images/ic-appstore-binary-bot.svg';
import IcAppstoreDerivBot from '../../public/images/ic-appstore-deriv-bot.svg';
import IcAppstoreDerivGo from '../../public/images/ic-appstore-deriv-go.svg';
import IcAppstoreDerivTrader from '../../public/images/ic-appstore-deriv-trader.svg';
import IcAppstoreSmartTrader from '../../public/images/ic-appstore-smart-trader.svg';
import { WalletButton, WalletText } from '../Base';
import { DerivAppsSection } from '../DerivAppsSection';
import { TradingAccountCard } from '../TradingAccountCard';
import './OptionsAndMultipliersListing.scss';

const optionsAndMultipliers = [
    {
        description: 'Options and multipliers trading platform.',
        icon: <IcAppstoreDerivTrader />,
        redirect: '/',
        title: 'Deriv Trader',
    },
    {
        description: 'Automate your trading, no coding needed.',
        icon: <IcAppstoreDerivBot />,
        redirect: '/bot',
        title: 'Deriv Bot',
    },
    {
        description: 'Our legacy options trading platform.',
        icon: <IcAppstoreSmartTrader />,
        redirect: '',
        title: 'SmartTrader',
    },
    {
        description: 'Our legacy automated trading platform.',
        icon: <IcAppstoreBinaryBot />,
        redirect: '',
        title: 'Binary Bot',
    },
    {
        description: 'Trade on the go with our mobile app.',
        icon: <IcAppstoreDerivGo />,
        redirect: '',
        title: 'Deriv GO',
    },
];

const OptionsAndMultipliersListing = () => {
    const history = useHistory();
    const { isMobile } = useDevice();

    return (
        <div className='wallets-options-and-multipliers-listing'>
            <section className='wallets-options-and-multipliers-listing__header'>
                <div className='wallets-options-and-multipliers-listing__header-title'>
                    {!isMobile && (
                        <WalletText align='center' lineHeight='6xl' size='3xl' weight='bold'>
                            Options & Multipliers
                        </WalletText>
                    )}
                    <div className='wallets-options-and-multipliers-listing__header-subtitle'>
                        <h1>
                            Earn a range of payouts by correctly predicting market price movements with{' '}
                            <a
                                className='wallets-options-and-multipliers-listing__header-subtitle__link'
                                href='#'
                                key={0}
                            >
                                options
                            </a>
                            , or get the upside of CFDs without risking more than your initial stake with{' '}
                            <a
                                className='wallets-options-and-multipliers-listing__header-subtitle__link'
                                href='#'
                                key={1}
                            >
                                multipliers
                            </a>
                        </h1>
                    </div>
                </div>
                <DerivAppsSection />
            </section>
            <div className='wallets-options-and-multipliers-listing__content'>
                {optionsAndMultipliers.map(account => (
                    <TradingAccountCard
                        {...account}
                        key={`trading-account-card-${account.title}`}
                        leading={() => (
                            <div className='wallets-options-and-multipliers-listing__content__icon'>{account.icon}</div>
                        )}
                        trailing={() => (
                            <WalletButton
                                onClick={() => {
                                    history.push(account.redirect);
                                }}
                                text='Open'
                            />
                        )}
                    >
                        <div className='wallets-options-and-multipliers-listing__content__details'>
                            <WalletText size='sm' weight='bold'>
                                {account.title}
                            </WalletText>

                            <WalletText lineHeight={isMobile ? 'md' : '2xs'} size={isMobile ? 'sm' : 'xs'}>
                                {account.description}
                            </WalletText>
                        </div>
                    </TradingAccountCard>
                ))}
            </div>
        </div>
    );
};

export default OptionsAndMultipliersListing;
