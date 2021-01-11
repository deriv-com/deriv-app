import * as React from 'react';
import { Text, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import Divider from 'Components/elements/divider'

const Facts: React.FC = () => {
    return (
        <React.Fragment>
        <section className='dw-description'>
            <Text className='dw-description__text'>
                {localize('Trade synthetic indices with leverage on MT5. Our synthetic indices are based on a cryptographically secure random number generator audited for fairness by an independent third party. These indices are engineered to simulate real-world market movement and are unaffected by natural events and disruptions. Synthetic indices are available 24/7, have constant volatility, fixed generation intervals, and are free of market and liquidity risks.')}
            </Text>
            <div className='dw-description__item-wrapper'>
                <div className='dw-description__item'>
                    <Icon className='dw-description__item-icon' icon='IcMt5HighLeverage' width='32' height='32' />
                    <Text>{localize('High leverage on margin trading, tight spreads')}</Text>
                </div>
                <div className='dw-description__item'>
                    <Icon className='dw-description__item-icon' icon='IcMt5LiquidRisk' width='32' height='32' />
                    <Text>{localize('Free from real-world market and liquidity risks')}</Text>
                </div>
                <div className='dw-description__item'>
                    <Icon className='dw-description__item-icon' icon='IcMt5Responsive' width='32' height='32' />
                    <Text>{localize('Responsive, easy-to-use platforms')}</Text>
                </div>
                <div className='dw-description__item'>
                    <Icon className='dw-description__item-icon' icon='IcMt5TradeTypes' width='32' height='32' />
                    <Text>{localize('Exclusive access to innovative trade types')}</Text>
                </div>
                <div className='dw-description__item'>
                    <Icon className='dw-description__item-icon' icon='IcMt5Support' width='32' height='32' />
                    <Text>{localize('Smart and friendly support, 7 days a week')}</Text>
                </div>
                <div className='dw-description__item'>
                    <Icon className='dw-description__item-icon' icon='IcMt5OpenMarkets' width='32' height='32' />
                    <Text>{localize('24/7 trading on ever-open markets')}</Text>
                </div>
            </div>
        </section>
        <Divider className='dw-description__divider' horizontal />
        </React.Fragment>
    );
};

export default Facts;
