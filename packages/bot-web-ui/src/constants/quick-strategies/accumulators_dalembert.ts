import { getImageLocation } from '../../public-path';
import { localize } from '@deriv/translations';
import { TDescriptionItem } from '../../pages/bot-builder/quick-strategy/types';

export const ACCUMULATORS_DALEMBERT: TDescriptionItem[] = [
    {
        type: 'subtitle',
        content: [localize('Exploring the D’Alembert strategy in Deriv Bot')],
        expanded: true,
        no_collapsible: false,
    },
    {
        type: 'text',
        content: [
            localize(
                "The D'Alembert strategy involves increasing your stake after a losing trade and reducing it after a successful trade by a predetermined number of units."
            ),
        ],
    },
    {
        type: 'subtitle',
        content: [localize('Key parameters')],
    },
    {
        type: 'text',
        content: [localize('These are the trade parameters used for D’Alembert strategy in Deriv Bot.')],
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
                '<strong>Unit:</strong> The number of units that are added in the event of a trade resulting in loss or the number of units removed in the event of a trade resulting in profit. For example, if the unit is set at 2, the stake increases or decreases by two times the initial stake of 1 USD, meaning it changes by 2 USD.'
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
        type: 'subtitle',
        content: [localize('An example of D’Alembert strategy')],
    },
    {
        type: 'media',
        src: getImageLocation('dalembert.svg'),
        alt: localize("An example of D’Alembert's Grind strategy"),
    },
    {
        type: 'text',
        content: [
            localize('1. Start with the initial stake. In this example, we’ll use 1 USD.'),
            localize('2. Set your preferred unit. In this example, it is 2 units or 2 USD.'),
            localize(
                '3. If the first trade results in profit, the stake for the following trade will not reduce but remain at the initial stake. The strategy minimally trades at the initial stake of 1 USD. See A1.'
            ),
            localize(
                '4. If the second trade results in a loss, the Deriv Bot will automatically increase your stake for the next trade by 2 USD. Deriv Bot will continue to add 2 USD to the previous round’s stake after every losing trade. See A2.'
            ),
            localize(
                '5. If the next trades are profitable, the stake for the following trade will be reduced by 2 USD. This can be shown above where the stake of 3 USD is reduced to 1 USD. See A3.'
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
                'The D’Alembert strategy is less risky than Martingale, but you can still determine how long your funds will last with this strategy before trading. Simply use this formula.'
            ),
        ],
    },
    {
        type: 'media',
        src: getImageLocation('dalembert_formula_1.svg'),
        dark_src: getImageLocation('dalembert_formula_dark_1.svg'),
        alt: localize('D’Alembert formula 1'),
        className: 'formula',
        styles: { height: '6rem' },
    },
    {
        type: 'text',
        content: [
            localize('Where:'),
            localize('R is the number of rounds a trader can sustain given a specific loss threshold.'),
            localize('B is the loss threshold.'),
            localize('s is the initial stake.'),
            localize('f is the unit increment.'),
        ],
        className: 'no-margin',
    },
    {
        type: 'text',
        content: [
            localize(
                'For instance, if a trader has a loss threshold (B) of 100 USD, with an initial stake (s) of 1 USD and 2 units of increment (f), the calculation would be as follows:'
            ),
        ],
        className: 'top-margin',
    },
    {
        type: 'media',
        src: getImageLocation('dalembert_formula_2.svg'),
        dark_src: getImageLocation('dalembert_formula_dark_2.svg'),
        alt: localize('D’Alembert formula 2'),
        className: 'formula',
        styles: { height: '6rem' },
    },
    {
        type: 'text',
        content: [localize('Number of rounds (R) = 10')],
    },
    {
        type: 'text',
        content: [
            localize(
                'This means after 10 rounds of consecutive losses, this trader will lose 100 USD. This reaches the loss threshold of 100 USD, stopping the bot.'
            ),
        ],
    },
    {
        type: 'text',
        content: [
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
                "The D'Alembert system offers more balanced trading through controlled stake progression. With prudent risk management like stake limits, it can be effectively automated in Deriv Bot. However, traders should thoroughly assess their risk appetite, test strategies on a demo account to align with their trading style before trading with real money. This allows optimising the approach and striking a balance between potential gains and losses whilst managing risk."
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
