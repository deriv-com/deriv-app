import { getImageLocation } from '../../public-path';
import { localize } from '@deriv/translations';
import { TDescriptionItem } from '../../pages/bot-builder/quick-strategy/types';

export const MARTINGALE: TDescriptionItem[] = [
    {
        type: 'subtitle',
        content: [localize('Exploring the Martingale strategy in Deriv Bot')],
        expanded: true,
        no_collapsible: false,
    },
    {
        type: 'text',
        content: [
            localize(
                'The Martingale strategy involves increasing your stake after each loss to recoup prior losses with a single successful trade.'
            ),
            localize(
                "This article explores the Martingale strategy integrated into Deriv Bot, a versatile trading bot designed to trade assets such as forex, commodities, and derived indices. We will delve into the strategy's core parameters, its application, and provide essential takeaways for traders looking to use the bot effectively."
            ),
        ],
    },
    {
        type: 'subtitle',
        content: [localize('Key parameters')],
    },
    {
        type: 'text',
        content: [localize('These are the trade parameters used in Deriv Bot with Martingale strategy.')],
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
                "<strong>Multiplier:</strong> The multiplier used to increase your stake if you're losing a trade. The value must be greater than 1."
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
        content: [localize('An example of Martingale strategy')],
    },
    {
        type: 'media',
        src: getImageLocation('martingale.svg'),
        alt: localize('An example of Martingale strategy'),
    },
    {
        type: 'text',
        content: [
            localize('1. Start with the initial stake. Let’s say 1 USD.'),
            localize('2. Select your Martingale multiplier. In this example, it is 2.'),
            localize(
                '3. If the first trade ends in a loss, Deriv Bot will automatically double your stake for the next trade to 2 USD. Deriv Bot will continue to double the stake after every losing trade.'
            ),
            localize(
                '4. If a trade ends in a profit, the stake for the following trade will be reset to the initial stake amount of 1 USD.'
            ),
        ],
    },
    {
        type: 'text',
        content: [
            localize(
                "The idea is that successful trades may recoup previous losses. However, it is crucial to exercise caution as the risk can quickly increase with this strategy. With Deriv Bot, you can minimise your risk by setting a maximum stake. This is an optional risk management feature. Let’s say a maximum stake of 3 USD. If your stake for the next trade is set to exceed 3 USD, your stake will reset to the initial stake of 1 USD. If you didn't set a maximum stake, it would have increased beyond 3 USD."
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
                "With Deriv Bot, traders can set the profit and loss thresholds to secure potential profits and limit potential losses. This means that the trading bot will automatically stop when either the profit or loss thresholds are reached. It's a form of risk management that can potentially enhance returns. For example, if a trader sets the profit threshold at 100 USD and the strategy exceeds 100 USD of profit from all trades, then the bot will stop running."
            ),
        ],
    },
    {
        type: 'subtitle',
        content: [localize('Estimating the lifespan of your trades')],
    },
    {
        type: 'text',
        content: [
            localize(
                "If you're about to start trading and haven't established a Maximum Stake as part of your risk management strategy, you can determine how long your funds will last by employing the Martingale strategy. Simply use this formula."
            ),
        ],
    },
    {
        type: 'media',
        src: getImageLocation('martingale_formula_1.svg'),
        dark_src: getImageLocation('martingale_formula_dark_1.svg'),
        alt: localize('Martingale formula 1'),
        className: 'formula',
        styles: { height: '6.5rem' },
    },
    {
        type: 'text',
        content: [
            localize('Where:'),
            localize('R is the number of rounds a trader can sustain given a specific loss threshold.'),
            localize('B is the loss threshold.'),
            localize('s is the initial stake.'),
            localize('m is the Martingale multiplier.'),
        ],
        className: 'no-margin',
    },
    {
        type: 'text',
        content: [
            localize(
                'For instance, if a trader has a loss threshold (B) is 1000 USD, with an initial stake (s) is 1 USD, and the Martingale multiplier (m) is 2, the calculation would be as follows:'
            ),
        ],
        className: 'top-margin',
    },
    {
        type: 'media',
        src: getImageLocation('martingale_formula_2.svg'),
        dark_src: getImageLocation('martingale_formula_dark_2.svg'),
        alt: localize('Martingale formula 2'),
        className: 'formula',
        styles: { height: '6.5rem' },
    },
    {
        type: 'text',
        content: [
            localize('Number of rounds, R ≈ 9.965'),
            localize(
                'This means that after 10 rounds of consecutive losses, this trader will lose 1023 USD which exceeds the loss threshold of 1000 USD, stopping the bot.'
            ),
            localize(
                'This formula helps you plan your trades by considering the amount of money you have and your comfort level with risk. It involves determining your loss threshold and the initial stake you want to trade with. Then, you use this formula to calculate the number of rounds you can trade. This process provides insight into stake sizing and expectations.'
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
                "The Martingale strategy in trading may offer substantial gains but also comes with significant risks. With your selected strategy, Deriv Bot provides automated trading with risk management measures like setting initial stake, stake size, maximum stake, profit threshold and loss threshold. It's crucial for traders to assess their risk tolerance, practice in a demo account, and understand the strategy before trading with real money."
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
