import React from 'react';
import classNames from 'classnames';
import { useDynamicLeverage } from '@deriv/api';
import { WalletText } from '../../../../components';
import { useDynamicLeverageModalState } from '../../components/DynamicLeverageContext';
import { DynamicLeverageMarketCard } from './DynamicLeverageMarketCard';
import './DynamicLeverageScreen.scss';

const DynamicLeverageScreen = () => {
    const { data: dynamicLeverages } = useDynamicLeverage();
    const { isDynamicLeverageVisible } = useDynamicLeverageModalState();

    return (
        <div
            className={classNames('wallets-dynamic-leverage-screen__container', {
                'wallets-dynamic-leverage-screen__container--flip': isDynamicLeverageVisible,
            })}
        >
            <WalletText>
                Enjoy dynamic leverage of <strong>up to 1:1500</strong> when trading selected instruments in the forex,
                commodities, cryptocurrencies, and stock indices markets. Our dynamic leverage adjusts automatically to
                your trading position, based on asset type and trading volume.
            </WalletText>
            <div className='wallets-dynamic-leverage-screen__content'>
                {dynamicLeverages.map(market => (
                    <DynamicLeverageMarketCard
                        data={market.data}
                        description={market.description}
                        key={`dynamic-leverage-screen__${market.key}`}
                        leverage={market.leverage}
                        title={market.title}
                    />
                ))}
            </div>
        </div>
    );
};
export default DynamicLeverageScreen;
