import { getImageLocation } from '../../../public-path';
import { localize } from '@deriv/translations';
import { TDescriptionItem } from '../types';

export const OSCAR_GRIND: TDescriptionItem[] = [
    {
        type: 'subtitle',
        content: [localize('Exploring the Oscar’s Grind strategy in Deriv Bot')],
    },
    {
        type: 'text',
        content: [
            localize(
                'The Oscar’s Grind strategy is designed to potentially gain a modest yet steady profit in each trading session. This strategy splits trades into sessions and has three principles.'
            ),
        ],
    },
    {
        type: 'subtitle',
        content: [localize('Key Parameters')],
    },
    {
        type: 'text',
        content: [localize('These are the trade parameters used for Oscar’s Grind strategy in Deriv Bot.')],
    },
    {
        type: 'text',
        content: [localize('<strong>Initial stake:</strong> The amount you pay to enter a trade.')],
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
        content: [localize('An example of Oscar’s Grind strategy')],
    },
    {
        type: 'media',
        src: getImageLocation('oscar-grind.svg'),
        alt: localize('An example of Oscar’s Grind strategy'),
    },
    {
        type: 'subtitle',
        content: [localize('Principle 1: Strategy aims to potentially make one unit of profit per session')],
    },
    {
        type: 'text',
        content: [
            localize(
                'The table above demonstrates this principle by showing that when a successful trade occurs and meets the target of one unit of profit which is 1 USD in this example, the session ends. If trading continues, a new session will begin.'
            ),
        ],
    },
    {
        type: 'subtitle',
        content: [
            localize('Principle 2: The stake only increases when a loss trade is followed by a successful trade'),
        ],
    },
    {
        type: 'text',
        content: [
            localize(
                'The table illustrates this principle in the second session. After a trade resulting in loss in round 4 followed by a successful trade in round 5, the stake will increase to 2 USD for round 6. This is in line with the strategy’s rule of raising the stake only after a loss is followed by a successful trade.'
            ),
        ],
    },
    {
        type: 'subtitle',
        content: [
            localize(
                'Principle 3: The stake adjusts to the gap size between current loss and the target profit for the session'
            ),
        ],
    },
    {
        type: 'text',
        content: [
            localize(
                'In round 7, the stake is adjusted downwards from 2 USD to 1 USD, to meet the target profit of $1.'
            ),
        ],
    },
    {
        type: 'text',
        content: [
            localize('The stake adjustment: target session profit (1 USD) - current session profit (0 USD) = 1 USD'),
        ],
    },
    {
        type: 'text',
        content: [
            localize(
                'The second session concludes upon reaching the aim of one unit of profit per session, equivalent to 1 USD. If trading continues, a new session will commence again.'
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
                'With Deriv Bot, traders can set the profit and loss thresholds to secure profits and limit potential losses. This means that the trading bot will automatically stop when either the profit or loss threshold is reached. This is a form of risk management that can potentially boost successful trades whilst limiting the impact of loss. For example, if a trader sets the profit threshold at 100 USD and the strategy exceeds 100 USD of profit from all trades, then the bot will stop running.'
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
                'The Oscar’s Grind strategy provides a disciplined approach for incremental gains through systematic stake progression. When integrated into Deriv Bot with proper risk management like profit or loss thresholds, it offers traders a potentially powerful automated trading technique. However, traders should first thoroughly assess their risk tolerance and first try trading on a demo account in order to familiarise with the strategy before trading with real funds.'
            ),
        ],
    },
    {
        type: 'subtitle_italic',
        content: [localize('<em>Disclaimers:</em>')],
    },
    {
        type: 'text_italic',
        content: [
            localize(
                '<i>Please be aware that while we may use rounded figures for illustration, a stake of a specific amount does not guarantee an exact amount in successful trades. For example, a 1 USD stake does not necessarily equate to a 1 USD profit in successful trades. Trading inherently involves risks, and actual profits can fluctuate due to various factors, including market volatility and other unforeseen variables. As such, exercise caution and conduct thorough research before engaging in any trading activities.</i>'
            ),
        ],
    },
    {
        type: 'text_italic',
        content: [
            localize(
                '<i>The information contained in this article is for educational purposes only and is not intended as financial or investment advice.</i>'
            ),
        ],
    },
];
