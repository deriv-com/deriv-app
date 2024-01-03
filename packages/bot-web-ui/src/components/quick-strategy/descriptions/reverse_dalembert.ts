import { getImageLocation } from '../../../public-path';
import { localize } from '@deriv/translations';
import { TDescriptionItem } from '../types';

export const REVERSE_D_ALEMBERT: TDescriptionItem[] = [
    {
        type: 'subtitle',
        content: [localize('Exploring the Reverse D’Alembert strategy in Deriv Bot')],
    },
    {
        type: 'text',
        content: [
            localize(
                "The Reverse D'Alembert strategy involves increasing your stake after a successful trade and reducing it after a losing trade by a predetermined number of units."
            ),
            localize('These are the trade parameters used for the Reverse D’Alembert strategy in Deriv Bot.'),
        ],
    },
    {
        type: 'text',
        content: [
            localize(
                '<strong>Initial stake:</strong> The amount that you are willing to place as a stake to enter a trade. In this example, we will use 1 USD.'
            ),
        ],
    },
    {
        type: 'text',
        content: [
            localize(
                '<strong>Unit:</strong> The number of units that are added in the event of successful trades or the number of units removed in the event of losing trades. For example, if the unit is set at 2, the stake increases or decreases by two times the initial stake of 1 USD, meaning it changes by 2 USD.'
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
        content: [localize('An example of Reverse D’Alembert strategy')],
    },
    {
        type: 'media',
        src: getImageLocation('reverse_dalembert.svg'),
        alt: localize('An example of Reverse D’Alembert strategy'),
    },
    {
        type: 'text',
        content: [
            localize('1. Start with the initial stake. Let’s say 1 USD.'),
            localize('2. Select your unit. In this example, it is 2 units or 2 USD.'),
            localize(
                '3. For trades that result in a profit, the stake for the next trade will be increased by 2 USD. Deriv Bot will continue to add 2 USD for every successful trade. See A1.'
            ),
            localize(
                '4. For trades that result in a loss, there are two outcomes.  If it was traded at the initial stake, the next trade will remain at the same amount as the strategy trades minimally at the initial stake, see A2. If it was traded with a higher amount, the stake for the next trade would be reduced by 2 USD, see A3.'
            ),
        ],
    },
    {
        type: 'subtitle',
        content: [localize('Profit and Loss Thresholds')],
    },
    {
        type: 'text',
        content: [
            localize(
                "At Deriv, traders can set the profit threshold and loss threshold to secure profits and limit potential losses. This means that the trading bot will automatically stop when either the profit or loss thresholds are reached. It's a form of risk management that can potentially enhance returns. For example, if a trader sets the profit threshold at 100 USD and the strategy exceeds 100 USD of profit from all trades, then the bot will stop running."
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
                "Effective trading with the D'Alembert system requires careful consideration of its stake progression and risk management. Traders can automate this approach using Deriv Bot, setting profit and loss thresholds to ensure balanced and controlled trading. However, it is crucial for traders to assess their risk appetite, test strategies on a demo account, and align with their own trading style before transitioning to real money trading. This optimization process helps strike a balance between potential gains and losses while managing risk prudently."
            ),
        ],
    },
    {
        type: 'subtitle_italic',
        content: [localize('Disclaimer')],
    },
    {
        type: 'text_italic',
        content: [
            localize(
                'Please be aware that while we may use rounded figures for illustration, a stake of a specific amount does not guarantee an exact amount in successful trades. For example, a 1 USD stake does not necessarily equate to a 1 USD  profit in successful trades.'
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
