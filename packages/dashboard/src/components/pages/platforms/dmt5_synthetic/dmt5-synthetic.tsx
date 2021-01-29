import * as React from 'react';
import { localize } from '@deriv/translations';
import Wrapper from '../components/wrapper';
import BackButton from '../components/back-button';
import GetSection from '../components/get-section';
import Preview from '../components/preview';
import Facts from '../components/facts';
import Description from '../components/description';
import Instruments from '../components/instruments';

const DMT5Synthetic: React.FC = () => {
    return (
        <Wrapper>
            <BackButton
                onClick={() => {
                    // TODO: back to mt5 dashboard
                }}
            />
            <GetSection
                icon='IcMt5SyntheticDashboard'
                title={localize('DMT5 Synthetic')}
                subtitle={localize('Trade CFDs on synthetic indices that simulate real-world market movements.')}
                trades={[
                    {
                        icon: 'IcMt5MarginTrading',
                        title: localize('Margin'),
                    },
                    {
                        icon: 'IcMt5MarginTrading',
                        title: localize('Margin2'),
                    },
                ]}
                markets={[
                    {
                        icon: 'IcMt5SyntheticIndices',
                        title: localize('Synthetic indices'),
                    },
                    {
                        icon: 'IcMt5SyntheticIndices',
                        title: localize('Synthetic indices2'),
                    },
                ]}
                onClickDemo={() => {
                    // TODO: handle demo click
                }}
                onClickGet={() => {
                    // TODO: handle get click
                }}
                link='TODO: add share link'
            />
            <Preview
                availability_text={localize('Available on desktop and mobile')}
                images={['platforms/dmt5-synthetic-1.png', 'platforms/dmt5-synthetic-2.png']}
            />
            <Facts
                leverage={localize('Up to 1:4000')}
                margin_call={localize('100%')}
                stop_out={localize('50%')}
                assets={localize('10')}
                min_stake={localize('$5')}
                duration={localize('1 tick - 365 days')}
            />
            <Description
                description={localize(
                    'Trade synthetic indices with leverage on MT5. Our synthetic indices are based on a cryptographically secure random number generator audited for fairness by an independent third party. These indices are engineered to simulate real-world market movement and are unaffected by natural events and disruptions. Synthetic indices are available 24/7, have constant volatility, fixed generation intervals, and are free of market and liquidity risks.'
                )}
                advantages={[
                    {
                        icon: 'IcMt5HighLeverage',
                        title: localize('High leverage on margin trading, tight spreads'),
                    },
                    {
                        icon: 'IcMt5LiquidRisk',
                        title: localize('Free from real-world market and liquidity risks'),
                    },
                    {
                        icon: 'IcMt5Responsive',
                        title: localize('Responsive, easy-to-use platforms'),
                    },
                    {
                        icon: 'IcMt5TradeTypes',
                        title: localize('Exclusive access to innovative trade types'),
                    },
                    {
                        icon: 'IcMt5Support',
                        title: localize('Smart and friendly support, 7 days a week'),
                    },
                    {
                        icon: 'IcMt5OpenMarkets',
                        title: localize('24/7 trading on ever-open markets'),
                    },
                ]}
            />
            <Instruments
                title={localize('Markets and instruments to trade on DMT5 Synthetics')}
                active_symbols={[
                    {
                        icon: 'IcMt5SyntheticIndices',
                        title: localize('Synthetic indices'),
                        submarkets: [
                            {
                                title: localize('Volatility indices'),
                                description: localize(
                                    'These indices correspond to simulated markets with constant volatilities of 10%, 25%, 50%, 75%, and 100%. One tick is generated every two seconds for volatility indices 10, 25, 50, 75, and 100. One tick is generated every second for volatility indices 10 (1s), 25 (1s), 50 (1s), 75 (1s), and 100 (1s).'
                                ),
                                symbols: [
                                    {
                                        icon: 'IcUnderlyingR_100',
                                        title: localize('Volatility 10 Index'),
                                    },
                                    {
                                        icon: 'IcUnderlyingR_100',
                                        title: localize('Volatility 10 Index'),
                                    },
                                    {
                                        icon: 'IcUnderlyingR_100',
                                        title: localize('Volatility 10 Index'),
                                    },
                                    {
                                        icon: 'IcUnderlyingR_100',
                                        title: localize('Volatility 10 Index'),
                                    },
                                    {
                                        icon: 'IcUnderlyingR_100',
                                        title: localize('Volatility 10 Index'),
                                    },
                                    {
                                        icon: 'IcUnderlyingR_100',
                                        title: localize('Volatility 10 Index'),
                                    },
                                    {
                                        icon: 'IcUnderlyingR_100',
                                        title: localize('Volatility 10 Index'),
                                    },
                                    {
                                        icon: 'IcUnderlyingR_100',
                                        title: localize('Volatility 10 Index'),
                                    },
                                    {
                                        icon: 'IcUnderlyingR_100',
                                        title: localize('Volatility 10 Index'),
                                    },
                                    {
                                        icon: 'IcUnderlyingR_100',
                                        title: localize('Volatility 10 Index'),
                                    },
                                ],
                            },
                            {
                                title: localize('Crash/Boom'),
                                description: localize(
                                    'With these indices, there is an average of one drop (crash) or one spike (boom) in prices that occur in a series of 1,000 or 500 ticks.'
                                ),
                                symbols: [
                                    {
                                        icon: 'IcUnderlyingR_100',
                                        title: localize('Volatility 10 Index'),
                                    },
                                    {
                                        icon: 'IcUnderlyingR_100',
                                        title: localize('Volatility 10 Index'),
                                    },
                                    {
                                        icon: 'IcUnderlyingR_100',
                                        title: localize('Volatility 10 Index'),
                                    },
                                    {
                                        icon: 'IcUnderlyingR_100',
                                        title: localize('Volatility 10 Index'),
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        icon: 'IcMt5SyntheticIndices',
                        title: localize('Synthetic indices'),
                        submarkets: [
                            {
                                title: localize('Volatility indices'),
                                description: localize(
                                    'These indices correspond to simulated markets with constant volatilities of 10%, 25%, 50%, 75%, and 100%. One tick is generated every two seconds for volatility indices 10, 25, 50, 75, and 100. One tick is generated every second for volatility indices 10 (1s), 25 (1s), 50 (1s), 75 (1s), and 100 (1s).'
                                ),
                                symbols: [
                                    {
                                        icon: 'IcUnderlyingR_100',
                                        title: localize('Volatility 10 Index'),
                                    },
                                    {
                                        icon: 'IcUnderlyingR_100',
                                        title: localize('Volatility 10 Index'),
                                    },
                                    {
                                        icon: 'IcUnderlyingR_100',
                                        title: localize('Volatility 10 Index'),
                                    },
                                    {
                                        icon: 'IcUnderlyingR_100',
                                        title: localize('Volatility 10 Index'),
                                    },
                                    {
                                        icon: 'IcUnderlyingR_100',
                                        title: localize('Volatility 10 Index'),
                                    },
                                    {
                                        icon: 'IcUnderlyingR_100',
                                        title: localize('Volatility 10 Index'),
                                    },
                                    {
                                        icon: 'IcUnderlyingR_100',
                                        title: localize('Volatility 10 Index'),
                                    },
                                    {
                                        icon: 'IcUnderlyingR_100',
                                        title: localize('Volatility 10 Index'),
                                    },
                                    {
                                        icon: 'IcUnderlyingR_100',
                                        title: localize('Volatility 10 Index'),
                                    },
                                    {
                                        icon: 'IcUnderlyingR_100',
                                        title: localize('Volatility 10 Index'),
                                    },
                                ],
                            },
                            {
                                title: localize('Crash/Boom'),
                                description: localize(
                                    'With these indices, there is an average of one drop (crash) or one spike (boom) in prices that occur in a series of 1,000 or 500 ticks.'
                                ),
                                symbols: [
                                    {
                                        icon: 'IcUnderlyingR_100',
                                        title: localize('Volatility 10 Index'),
                                    },
                                    {
                                        icon: 'IcUnderlyingR_100',
                                        title: localize('Volatility 10 Index'),
                                    },
                                    {
                                        icon: 'IcUnderlyingR_100',
                                        title: localize('Volatility 10 Index'),
                                    },
                                    {
                                        icon: 'IcUnderlyingR_100',
                                        title: localize('Volatility 10 Index'),
                                    },
                                ],
                            },
                        ],
                    },
                ]}
            />
        </Wrapper>
    );
};

export default DMT5Synthetic;
