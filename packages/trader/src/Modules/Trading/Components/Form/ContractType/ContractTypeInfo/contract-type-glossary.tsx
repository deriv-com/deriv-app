import React from 'react';
import { Text } from '@deriv/components';
import { TRADE_TYPES } from '@deriv/shared';
import { Localize } from '@deriv/translations';

const ContractTypeGlossary = ({
    category,
    is_vanilla_fx = false,
    is_major_pairs = false,
    is_multiplier_fx = false,
}: {
    category: string;
    is_vanilla_fx?: boolean;
    is_major_pairs?: boolean;
    is_multiplier_fx?: boolean;
}) => {
    let content;
    let trade_category = category;
    if (trade_category === TRADE_TYPES.VANILLA.CALL && is_vanilla_fx) trade_category = TRADE_TYPES.VANILLA.FX;
    if (category) {
        switch (trade_category) {
            case TRADE_TYPES.ACCUMULATOR:
                content = [
                    { type: 'heading', text: <Localize i18n_default_text='Growth rate' /> },
                    {
                        type: 'paragraph',
                        text: (
                            <Localize i18n_default_text='You can choose a growth rate with values of 1%, 2%, 3%, 4%, and 5%.' />
                        ),
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Payout' /> },
                    {
                        type: 'paragraph',
                        text: <Localize i18n_default_text='Payout is the sum of your initial stake and profit.' />,
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Range' /> },
                    {
                        type: 'paragraph',
                        text: (
                            <Localize i18n_default_text='It is a percentage of the previous spot price. The percentage rate is based on your choice of the index and the growth rate.' />
                        ),
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Previous spot price' /> },
                    {
                        type: 'paragraph',
                        text: <Localize i18n_default_text='Spot price on the previous tick.' />,
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Slippage risk' /> },
                    {
                        type: 'paragraph',
                        text: (
                            <Localize i18n_default_text='The spot price may change by the time your order reaches our servers. When this happens, your payout may be affected.' />
                        ),
                    },
                ];
                break;
            case TRADE_TYPES.TURBOS.LONG:
            case TRADE_TYPES.TURBOS.SHORT:
                content = [
                    { type: 'heading', text: <Localize i18n_default_text='Payout' /> },
                    {
                        type: 'paragraph',
                        text: (
                            <Localize i18n_default_text='Your payout is equal to the payout per point multiplied by the difference between the final price and barrier.' />
                        ),
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Expiry' /> },
                    {
                        type: 'paragraph',
                        text: (
                            <Localize i18n_default_text='This is when your contract will expire based on the duration or end time you’ve selected. If the duration is more than 24 hours, the cut-off time and expiry date will apply instead.' />
                        ),
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Barrier' /> },
                    {
                        type: 'paragraph',
                        text: (
                            <Localize i18n_default_text='This is a price level that you choose. If this barrier is ever crossed, your contract would be terminated.' />
                        ),
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Payout per point' /> },
                    {
                        type: 'paragraph',
                        text: <Localize i18n_default_text='We calculate this based on the barrier you’ve selected.' />,
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Final price' /> },
                    {
                        type: 'paragraph',
                        text: <Localize i18n_default_text='This is the spot price of the last tick at expiry.' />,
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Contract value' /> },
                    {
                        type: 'paragraph',
                        text: (
                            <Localize i18n_default_text='We’ll offer to buy your contract at this price should you choose to sell it before its expiry. This is based on several factors, such as the current spot price. We won’t offer a contract value if the remaining duration is below 15 seconds or if the contract duration is in ticks.' />
                        ),
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Cut-off time' /> },
                    {
                        type: 'paragraph',
                        text: (
                            <Localize i18n_default_text='Your contract will expire at exactly 23:59:59 GMT +0 on your selected expiry date.' />
                        ),
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Expiry date' /> },
                    {
                        type: 'paragraph',
                        text: (
                            <Localize i18n_default_text='Your contract will expire on this date (in GMT), based on the end time you’ve selected.' />
                        ),
                    },
                ];
                break;
            case TRADE_TYPES.VANILLA.CALL:
            case TRADE_TYPES.VANILLA.PUT:
                content = [
                    { type: 'heading', text: <Localize i18n_default_text='Payout' /> },
                    {
                        type: 'paragraph',
                        text: (
                            <Localize i18n_default_text='Your payout is equal to the payout per point multiplied by the difference between the final price and the strike price.' />
                        ),
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Final price' /> },
                    {
                        type: 'paragraph',
                        text: <Localize i18n_default_text='This is the spot price of the last tick at expiry.' />,
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Strike price' /> },
                    {
                        type: 'paragraph',
                        text: (
                            <Localize i18n_default_text='You must select the strike price before entering the contract.' />
                        ),
                    },
                    {
                        type: 'list',
                        text: [
                            <Localize
                                i18n_default_text='If you select "Call", you’ll earn a payout if the final price is above the strike price at expiry. Otherwise, you won’t receive a payout.'
                                key='0'
                            />,
                            <Localize
                                i18n_default_text='If you select "Put", you’ll earn a payout if the final price is below the strike price at expiry. Otherwise, you won’t receive a payout.'
                                key='1'
                            />,
                        ],
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Expiry' /> },
                    {
                        type: 'paragraph',
                        text: (
                            <Localize i18n_default_text='This is when your contract will expire based on the Duration or End time you’ve selected.' />
                        ),
                    },
                    {
                        type: 'list',
                        text: [
                            <Localize
                                i18n_default_text='If the duration is more than 24 hours, the Cut-off time and Expiry date will apply instead.'
                                key='0'
                            />,
                        ],
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Payout per point' /> },
                    {
                        type: 'paragraph',
                        text: (
                            <Localize i18n_default_text='We calculate this based on the strike price and duration you’ve selected.' />
                        ),
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Contract value' /> },
                    {
                        type: 'paragraph',
                        text: (
                            <Localize i18n_default_text='We’ll offer to buy your contract at this price should you choose to sell it before its expiry. This is based on several factors, such as the current spot price, duration, etc. However, we won’t offer a contract value if the remaining duration is below 60 seconds.' />
                        ),
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Cut-off time' /> },
                    {
                        type: 'paragraph',
                        text: (
                            <Localize i18n_default_text='Contracts will expire at exactly 23:59:59 GMT on your selected expiry date.' />
                        ),
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Expiry date' /> },
                    {
                        type: 'paragraph',
                        text: (
                            <Localize i18n_default_text='Your contract will expire on this date (in GMT), based on the End time you’ve selected.' />
                        ),
                    },
                ];
                break;
            case TRADE_TYPES.MULTIPLIER:
                content = [
                    { type: 'heading', text: <Localize i18n_default_text='Stop out' /> },
                    {
                        type: 'paragraph',
                        text: (
                            <Localize i18n_default_text='Your trade will be closed automatically at the nearest available asset price when your loss reaches a certain percentage of your stake, but your loss never exceeds your stake. This percentage depends on the chosen underlying asset and the Multiplier.' />
                        ),
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Take profit' /> },
                    {
                        type: 'paragraph',
                        text: (
                            <Localize i18n_default_text='If you select this feature, your trade will be closed automatically at the nearest available asset price when your profit reaches or exceeds the take profit amount. Your profit may be more than the amount you entered depending on the market price at closing.' />
                        ),
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Stop loss' /> },
                    {
                        type: 'paragraph',
                        text: (
                            <Localize i18n_default_text='If you select this feature, your trade will be closed automatically at the nearest available asset price when your loss reaches or exceeds the stop loss amount. Your loss may be more than the amount you entered depending on the market price at closing.' />
                        ),
                    },
                    {
                        type: is_multiplier_fx ? '' : 'heading',
                        text: <Localize i18n_default_text='Deal cancellation' />,
                    },
                    {
                        type: is_multiplier_fx ? '' : 'paragraph',
                        text: (
                            <Localize i18n_default_text='If you select this feature, you can cancel your trade within a chosen time frame if the asset price moves against your favour. You will get your stake back without profit/loss. We charge a small fee for this. Take profit and stop loss are disabled when deal cancellation is active.' />
                        ),
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Slippage risk' /> },
                    {
                        type: 'paragraph',
                        text: (
                            <Localize i18n_default_text='Slippage happens when the asset price changes by the time it reaches our servers.' />
                        ),
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Entry spot' /> },
                    {
                        type: 'paragraph',
                        text: is_major_pairs ? (
                            <Localize i18n_default_text='We use next-tick-execution mechanism, which is the next asset price when the trade opening is processed by our servers for Major Pairs.' />
                        ) : (
                            <Localize i18n_default_text='We use current-tick-execution mechanism, which is the latest asset price when the trade opening is processed by our servers for Volatility Index, Basket Indices, Jump Indices and Crash/Boom Indices.' />
                        ),
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Exit spot' /> },
                    {
                        type: 'paragraph',
                        text: (
                            <Localize i18n_default_text='The latest asset price when the trade closure is processed by our servers.' />
                        ),
                    },
                ];
                break;
            case TRADE_TYPES.VANILLA.FX:
                content = [
                    { type: 'heading', text: <Localize i18n_default_text='Strike price' /> },
                    {
                        type: 'paragraph',
                        text: (
                            <Localize i18n_default_text='You must select the strike price before entering the contract.' />
                        ),
                    },
                    {
                        type: 'list',
                        text: [
                            <Localize
                                i18n_default_text='If you select "Call", you’ll earn a payout if the final price is above the strike price at expiry. Otherwise, you won’t receive a payout.'
                                key='0'
                            />,
                            <Localize
                                i18n_default_text='If you select "Put", you’ll earn a payout if the final price is below the strike price at expiry. Otherwise, you won’t receive a payout.'
                                key='1'
                            />,
                        ],
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Payout' /> },
                    {
                        type: 'paragraph',
                        text: (
                            <Localize
                                i18n_default_text='Your payout is equal to the payout per pip multiplied by the difference, <0>in pips</0>, between the final price and the strike price.'
                                components={[<strong key={0} />]}
                            />
                        ),
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Payout per pip' /> },
                    {
                        type: 'paragraph',
                        text: (
                            <Localize i18n_default_text='We calculate this based on the strike price and duration you’ve selected.' />
                        ),
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Final price' /> },
                    {
                        type: 'paragraph',
                        text: <Localize i18n_default_text='Spot price of the last tick upon reaching expiry.' />,
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Expiry' /> },
                    {
                        type: 'paragraph',
                        text: (
                            <Localize i18n_default_text='This is when your contract will expire based on the Duration or End time you’ve selected.' />
                        ),
                    },
                    {
                        type: 'list',
                        text: [
                            <Localize
                                i18n_default_text='If the duration is more than 24 hours, the Cut-off time and Expiry date will apply instead.'
                                key='0'
                            />,
                        ],
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Cut-off time' /> },
                    {
                        type: 'paragraph',
                        text: (
                            <Localize i18n_default_text='Contracts will expire at exactly 14:00:00 GMT on your selected expiry date.' />
                        ),
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Expiry date' /> },
                    {
                        type: 'paragraph',
                        text: (
                            <Localize i18n_default_text='Your contract will expire on this date (in GMT), based on the End time you’ve selected.' />
                        ),
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Contract value' /> },
                    {
                        type: 'paragraph',
                        text: (
                            <Localize i18n_default_text='We’ll offer to buy your contract at this price should you choose to sell it before its expiry. This is based on several factors, such as the current spot price, duration, etc. However, we won’t offer a contract value if the remaining duration is below 24 hours.' />
                        ),
                    },
                ];
                break;
            default:
                content = [];
                break;
        }
    }
    return (
        <React.Fragment>
            {content?.map(({ type, text }: { type: string; text: JSX.Element | JSX.Element[] }) => {
                if (type === 'heading' && !Array.isArray(text)) {
                    return (
                        <Text
                            as='h2'
                            key={text.props.i18n_default_text}
                            weight='bold'
                            className='contract-type-info__content-glossary--heading'
                        >
                            {text}
                        </Text>
                    );
                }
                if (type === 'paragraph' && !Array.isArray(text)) {
                    return (
                        <Text as='p' key={text.props.i18n_default_text}>
                            {text}
                        </Text>
                    );
                }
                if (type === 'list' && Array.isArray(text)) {
                    return (
                        <ul key={text[0].props.i18n_default_text}>
                            {text.map(list_item_text => (
                                <li key={list_item_text.props.i18n_default_text}>{list_item_text}</li>
                            ))}
                        </ul>
                    );
                }
            })}
        </React.Fragment>
    );
};

export default ContractTypeGlossary;
