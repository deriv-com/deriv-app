import { getImageLocation } from '../../public-path';
import { localize } from '@deriv/translations';
import { TDescriptionItem } from '../../pages/bot-builder/quick-strategy/types';

export const REVERSE_MARTINGALE: TDescriptionItem[] = [
    {
        type: 'subtitle',
        content: [localize('Exploring the Reverse Martingale strategy in Deriv Bot')],
        expanded: true,
        no_collapsible: false,
    },
    {
        type: 'text',
        content: [
            localize(
                'The Reverse Martingale strategy involves increasing your stake after each successful trade and resets to the initial stake for every losing trade as it aims to secure potential profits from consecutive wins.'
            ),
            localize(
                "This article explores the Reverse Martingale strategy integrated into Deriv Bot, a versatile trading bot designed to trade assets such as forex, commodities, and derived indices. We will delve into the strategy's core parameters, its application, and provide essential takeaways for traders looking to use the bot effectively."
            ),
        ],
    },
    {
        type: 'subtitle',
        content: [localize('Key parameters')],
    },
    {
        type: 'text',
        content: [localize('These are the trade parameters used in Deriv Bot with Reverse Martingale strategy.')],
    },
    {
        type: 'text',
        content: [
            localize(
                '<strong>Initial stake:</strong> The amount that you are willing to place as a stake to enter a trade. This is the starting point for any changes in stake depending on the dynamic of the strategy being used.'
            ),
        ],
    },
    {
        type: 'text',
        content: [
            localize(
                '<strong>Multiplier:</strong> The multiplier used to increase your stake if your trade is successful. The value must be greater than 1.'
            ),
        ],
    },
    {
        type: 'text',
        content: [
            localize(
                '<strong>Profit threshold:</strong> The bot will stop trading if your total profit exceeds this amount.'
            ),
        ],
    },
    {
        type: 'text',
        content: [
            localize(
                '<strong>Loss threshold:</strong> The bot will stop trading if your total loss exceeds this amount.'
            ),
        ],
    },
    {
        type: 'text',
        content: [
            localize(
                '<strong>Maximum stake:</strong> The maximum amount you are willing to pay to enter a single trade. The stake for your next trade will reset to the initial stake if it exceeds this value. This is an optional risk management parameter.'
            ),
        ],
    },
    {
        type: 'subtitle',
        content: [localize('An example of Reverse Martingale strategy')],
    },
    {
        type: 'media',
        src: getImageLocation('reverse_martingale.svg'),
        alt: localize('An example of Martingale strategy'),
    },
    {
        type: 'text',
        content: [
            localize('1. Start with the initial stake. Let’s say 1 USD.'),
            localize('2. Select your Martingale multiplier. In this example, it is 2.'),
            localize(
                '3. If the first trade is a successful trade, Deriv Bot will automatically double your stake for the next trade to 2 USD. Deriv Bot will continue to double the stake after every successful trade.'
            ),
            localize(
                '4. If a trade ends in a loss, the stake for the following trade will be reset to the initial stake amount of 1 USD.'
            ),
        ],
    },
    {
        type: 'text',
        content: [
            localize(
                'The objective of Martingale strategy is to take advantage of consecutive successful trades and maximise potential profits from them. This strategy is beneficial only if there are consecutive successful trades. Therefore, it is important to set a maximum stake to secure all the potential profits gained from a number of consecutive successful trades, or you could lose all the profits you have accumulated, including your initial stake. For example, if your goal is to maximise profits within 2 consecutive successful trades, you set a maximum stake of 2 USD, given your initial stake is 1 USD. Similarly, if your goal is to maximise profits within 3 consecutive successful trades, you set a maximum stake of 4 USD, given your initial stake is 1 USD.'
            ),
        ],
    },
    {
        type: 'subtitle',
        content: [localize('Profit and loss thresholds')],
    },
    {
        type: 'text',
        content: [
            localize(
                'With Deriv Bot, traders can set the profit and loss thresholds to secure potential profits and limit potential losses. This means that the trading bot will automatically stop when either the profit or loss threshold is reached. This is a form of risk management that can potentially boost successful trades whilst limiting the impact of loss. For example, if a trader sets the profit threshold at 100 USD and the strategy exceeds 100 USD of profit from all trades, then the bot will stop running.'
            ),
        ],
    },
    {
        type: 'subtitle',
        content: [localize('Summary')],
    },
    {
        type: 'text',
        content: [
            localize(
                "The Reverse Martingale strategy in trading may offer substantial gains but also comes with significant risks. With your selected strategy, Deriv Bot provides automated trading with risk management measures like setting initial stake, stake size, maximum stake, profit threshold and loss threshold. It's crucial for traders to assess their risk tolerance, practice in a demo account, and understand the strategy before trading with real money."
            ),
        ],
    },
    {
        type: 'text_italic',
        content: [localize('<strong>Disclaimer:</strong>')],
    },
    {
        type: 'text_italic',
        content: [
            localize(
                'Please be aware that while we may use rounded figures for illustration, a stake of a specific amount does not guarantee an exact amount in successful trades. For example, a 1 USD stake does not necessarily equate to a 1 USD profit in successful trades.'
            ),
        ],
    },
    {
        type: 'text_italic',
        content: [
            localize(
                'Trading inherently involves risks, and actual profits can fluctuate due to various factors, including market volatility and other unforeseen variables. As such, exercise caution and conduct thorough research before engaging in any trading activities.'
            ),
        ],
    },
];
