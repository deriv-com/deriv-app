import { getImageLocation } from '../../public-path';
import { localize } from '@deriv/translations';
import { TDescriptionItem } from '../../pages/bot-builder/quick-strategy/types';

export const STRATEGY_1_3_2_6: TDescriptionItem[] = [
    {
        type: 'subtitle',
        content: [localize('Exploring the 1-3-2-6 strategy in Deriv Bot')],
        expanded: true,
        no_collapsible: false,
    },
    {
        type: 'text',
        content: [
            localize(
                'The 1-3-2-6 strategy aims to maximise potential profits with four consecutive successful trades. One unit is equal to the amount of the initial stake. The stake will adjust from 1 unit to 3 units after the first successful trade, then to 2 units after your second successful trade, and to 6 units after the third successful trade. The stake for the next trade will reset to the initial stake if there is a losing trade or a completion of the trade cycle.'
            ),
            localize(
                "This article explores the strategy integrated into Deriv Bot, a versatile trading bot designed to trade assets such as Forex, Commodities, and Derived Indices. We will delve into the strategy's core parameters, its application, and provide essential takeaways for traders looking to use the bot effectively."
            ),
        ],
    },
    {
        type: 'subtitle',
        content: [localize('Key parameters')],
    },
    {
        type: 'text',
        content: [localize('These are the trade parameters used in Deriv Bot with 1-3-2-6 strategy.')],
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
        content: [localize('An example of 1-3-2-6 strategy')],
    },
    {
        type: 'media',
        src: getImageLocation('1-3-2-6.svg'),
        alt: localize('An example of 1-3-2-6 strategy'),
    },
    {
        type: 'text',
        content: [
            localize('1. Start with the initial stake. Let’s say 1 USD.'),
            localize(
                '2. If the trade is successful, this strategy will automatically adjust your stake to 3 units of your initial stake for the next trade. In this case, the stake adjustment is 3 units and the initial stake is 1 USD, hence the next trade will start at 3 USD.'
            ),
            localize(
                '3. If the second trade is also successful, your stake will adjust to 2 USD or 2 units of the initial stake for the next trade.'
            ),
            localize(
                '4. However, if any trade results in a loss, your stake will reset back to the initial stake of 1 USD for the next trade. The third trade results in a loss hence the stake resets to the initial stake of 1 USD for the next trade.'
            ),
            localize(
                '5. Upon reaching the initial stake, if the next trade still results in a loss, your stake will remain at the initial stake of 1 USD. This strategy will minimally trade at the initial stake. Refer to the fourth and fifth trade.'
            ),
            localize(
                '6. If consecutive successful trades were to happen, the stake would follow a sequence of adjustment from 1 to 3, then 2, and 6 units of initial stake. After 4 consecutive successful trades, it completes one cycle and then the strategy will repeat itself for another cycle. If any trade results in a loss, your stake will reset back to the initial stake for the next trade.'
            ),
        ],
    },
    {
        type: 'text',
        content: [
            localize(
                'The 1-3-2-6 strategy is designed to capitalise on consecutive successful trades while minimising losses during losing streaks. The rationale behind this strategy lies in statistical probabilities, with adjustments to stake sizes based on the perceived likelihood of success. There is a higher likelihood of success in the second trade after one successful trade. Hence the stake adjusts to 3 in the second trade. In the third trade, the stake adjusts to 2 units due to a lower probability of a successful trade. If the third trade is also successful, the strategy then allocates all the previous gains (a total of 6 units of initial stake) into the fourth trade with the aim of doubling the potential profits. If the fourth trade results in a positive outcome, the strategy helps achieve a total gain of 12 units. However, it is crucial to exercise caution, as the risk can escalate quickly with this strategy, and any loss in the fourth trade forfeits all previous gains.'
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
                'The 1-3-2-6 strategy in trading may offer substantial gains but also comes with significant risks. Each stake is independent, and the strategy does not increase your chances of successful trades in the long run. If you encounter a series of losses, the strategy can lead to significant losses. Therefore, it is crucial for traders to assess their risk tolerance, practice in a demo account, utilise profit and loss thresholds, and fully comprehend the strategy before engaging in real-money trading.'
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
            localize(
                'Trading inherently involves risks, and actual profits can fluctuate due to various factors, including market volatility and other unforeseen variables. As such, exercise caution and conduct thorough research before engaging in any trading activities.'
            ),
        ],
    },
];
