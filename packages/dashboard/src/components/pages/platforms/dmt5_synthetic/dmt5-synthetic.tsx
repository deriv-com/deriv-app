import * as React from 'react';
import { Localize } from '@deriv/translations';
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
                title={<Localize i18n_translate_text='DMT5 Synthetic' />}
                subtitle={<Localize i18n_translate_text='Trade CFDs on synthetic indices that simulate real-world market movements.' />}
                trades={[
                    {
                        icon: 'IcMt5MarginTrading',
                        title: <Localize i18n_translate_text='Margin' />,
                    },
                ]}
                markets={[
                    {
                        icon: 'IcMt5SyntheticIndices',
                        title: <Localize i18n_translate_text='Synthetic indices' />,
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
                availability_text={<Localize i18n_translate_text='Available on desktop and mobile' />}
                images={['platforms/dmt5-synthetic-1.png', 'platforms/dmt5-synthetic-2.png']}
            />
            <Facts
                leverage={<Localize i18n_translate_text='Up to 1:4000' />}
                margin_call={<Localize i18n_translate_text='100%' />}
                stop_out={<Localize i18n_translate_text='50%' />}
                assets={<Localize i18n_translate_text='10' />}
                min_stake={<Localize i18n_translate_text='$5' />}
                duration={<Localize i18n_translate_text='1 tick - 365 days' />}
            />
            <Description
                description={<Localize i18n_translate_text='Trade synthetic indices with leverage on MT5. Our synthetic indices are based on a cryptographically secure random number generator audited for fairness by an independent third party. These indices are engineered to simulate real-world market movement and are unaffected by natural events and disruptions. Synthetic indices are available 24/7, have constant volatility, fixed generation intervals, and are free of market and liquidity risks.' />}
                advantages={[
                    {
                        icon: 'IcMt5HighLeverage',
                        title: <Localize i18n_translate_text='High leverage on margin trading, tight spreads' />,
                    },
                    {
                        icon: 'IcMt5LiquidRisk',
                        title: <Localize i18n_translate_text='Free from real-world market and liquidity risks' />,
                    },
                    {
                        icon: 'IcMt5Responsive',
                        title: <Localize i18n_translate_text='Responsive, easy-to-use platforms' />,
                    },
                    {
                        icon: 'IcMt5TradeTypes',
                        title: <Localize i18n_translate_text='Exclusive access to innovative trade types' />,
                    },
                    {
                        icon: 'IcMt5Support',
                        title: <Localize i18n_translate_text='Smart and friendly support, 7 days a week' />,
                    },
                    {
                        icon: 'IcMt5OpenMarkets',
                        title: <Localize i18n_translate_text='24/7 trading on ever-open markets' />,
                    },
                ]}
            />
            <Instruments title={<Localize i18n_translate_text='Markets and instruments to trade on DMT5 Synthetics' />} active_symbols={[
                {
                    icon: 'IcMt5SyntheticIndices',
                    title: <Localize i18n_translate_text='Synthetic indices' />,
                    submarkets: [
                        {
                            title: <Localize i18n_translate_text='Volatility indices' />,
                            description: <Localize i18n_translate_text='These indices correspond to simulated markets with constant volatilities of 10%, 25%, 50%, 75%, and 100%. One tick is generated every two seconds for volatility indices 10, 25, 50, 75, and 100. One tick is generated every second for volatility indices 10 (1s), 25 (1s), 50 (1s), 75 (1s), and 100 (1s).' />,
                            symbols: [
                                {
                                    icon: 'IcUnderlyingR_100',
                                    title: <Localize i18n_translate_text='Volatility 10 Index' />,
                                },
                                {
                                    icon: 'IcUnderlyingR_100',
                                    title: <Localize i18n_translate_text='Volatility 10 Index' />,
                                },
                                {
                                    icon: 'IcUnderlyingR_100',
                                    title: <Localize i18n_translate_text='Volatility 10 Index' />,
                                },
                                {
                                    icon: 'IcUnderlyingR_100',
                                    title: <Localize i18n_translate_text='Volatility 10 Index' />,
                                },
                                {
                                    icon: 'IcUnderlyingR_100',
                                    title: <Localize i18n_translate_text='Volatility 10 Index' />,
                                },
                                {
                                    icon: 'IcUnderlyingR_100',
                                    title: <Localize i18n_translate_text='Volatility 10 Index' />,
                                },
                                {
                                    icon: 'IcUnderlyingR_100',
                                    title: <Localize i18n_translate_text='Volatility 10 Index' />,
                                },
                                {
                                    icon: 'IcUnderlyingR_100',
                                    title: <Localize i18n_translate_text='Volatility 10 Index' />,
                                },
                                {
                                    icon: 'IcUnderlyingR_100',
                                    title: <Localize i18n_translate_text='Volatility 10 Index' />,
                                },
                                {
                                    icon: 'IcUnderlyingR_100',
                                    title: <Localize i18n_translate_text='Volatility 10 Index' />,
                                },
                            ],
                        },
                        {
                            title: <Localize i18n_translate_text='Crash/Boom' />,
                            description: <Localize i18n_translate_text='With these indices, there is an average of one drop (crash) or one spike (boom) in prices that occur in a series of 1,000 or 500 ticks.' />,
                            symbols: [
                                {
                                    icon: 'IcUnderlyingR_100',
                                    title: <Localize i18n_translate_text='Volatility 10 Index' />,
                                },
                                {
                                    icon: 'IcUnderlyingR_100',
                                    title: <Localize i18n_translate_text='Volatility 10 Index' />,
                                },
                                {
                                    icon: 'IcUnderlyingR_100',
                                    title: <Localize i18n_translate_text='Volatility 10 Index' />,
                                },
                                {
                                    icon: 'IcUnderlyingR_100',
                                    title: <Localize i18n_translate_text='Volatility 10 Index' />,
                                },
                            ],
                        },
                    ],
                },
            ]} />
        </Wrapper>
    );
};

export default DMT5Synthetic;
