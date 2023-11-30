import { getImageLocation } from '../../../public-path';
import { localize } from '@deriv/translations';
import '../quick-strategy.scss';

type TDescriptionItem = {
    type: string;
    content?: string[];
    src?: string;
};

export const MARTINGALE: TDescriptionItem[] = [
    {
        type: 'subtitle',
        content: [localize('Exploring the Martingale strategy in Deriv Bot')],
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
        content: [localize('Key Parameters')],
    },
    {
        type: 'text',
        content: [localize('These are the trade parameters used in Deriv Bot with Martingale strategy.')],
    },
    {
        type: 'text',
        content: [
            localize(
                '<strong>Initial stake:</strong> The amount you pay to enter a trade. This is the starting point for any changes in stake depending on the dynamic of the strategy being used.'
            ),
        ],
    },
    // {
    //     content: (
    //         <Localize
    //             key={0}
    //             i18n_default_text="<0>Multiplier:</0> The multiplier used to increase your stake if you're losing a trade. The value must be greater than 1."
    //             components={[<strong key={0} />]}
    //         />
    //     ),
    // },
    // {
    //     content: (
    //         <Localize
    //             key={0}
    //             i18n_default_text='<0>Profit threshold:</0> The bot will stop trading if your total profit exceeds this amount.'
    //             components={[<strong key={0} />]}
    //         />
    //     ),
    // },
    // {
    //     content: (
    //         <Localize
    //             key={0}
    //             i18n_default_text='<0>Loss threshold:</0> The bot will stop trading if your total loss exceeds this amount.'
    //             components={[<strong key={0} />]}
    //         />
    //     ),
    // },
    // {
    //     content: (
    //         <Localize
    //             key={0}
    //             i18n_default_text='<0>Maximum stake:</0> The maximum amount you are willing to pay to enter a single trade. The stake for your next trade will reset to the initial stake if it exceeds this value. This is an optional risk management parameter.'
    //             components={[<strong key={0} />]}
    //         />
    //     ),
    // },
    {
        type: 'subtitle',
        content: [localize('An example of Martingale strategy')],
    },
    {
        type: 'media',
        src: getImageLocation('martingale.png'),
    },
    // {
    //     content: (
    //         <>
    //             <div>
    //                 <Localize key={0} i18n_default_text='1. Start with the initial stake. Let’s say $1.' />,
    //             </div>
    //             <div>
    //                 <Localize
    //                     key={0}
    //                     i18n_default_text='2. Select your Martingale multiplier. In this example, it is 2.'
    //                 />
    //             </div>
    //             <div>
    //                 <Localize
    //                     key={0}
    //                     i18n_default_text='3. If the first trade ends in a loss, Deriv Bot will automatically double your stake for the next trade to $2. Deriv Bot will continue to double the stake after every losing trade.'
    //                 />
    //             </div>
    //             <div>
    //                 <Localize
    //                     key={0}
    //                     i18n_default_text='4. If a trade ends in a profit, the stake for the following trade will be reset to the initial stake amount of $1.'
    //                 />
    //             </div>
    //         </>
    //     ),
    // },
    // {
    //     content: (
    //         <Localize
    //             key={0}
    //             i18n_default_text="The idea is that successful trades may recoup previous losses. However, it is crucial to exercise caution as the risk can quickly increase with this strategy. With Deriv Bot, you can minimise your risk by setting a maximum stake. This is an optional risk management feature. Let’s say a maximum stake of $3. If your stake for the next trade is set to exceed $3, your stake will reset to the initial stake of $1. If you didn't set a maximum stake, it would have increased beyond $3."
    //         />
    //     ),
    // },
    // {
    //     title: <Localize key={0} i18n_default_text='Profit and Loss Thresholds' />,
    //     content: (
    //         <Localize
    //             key={0}
    //             i18n_default_text='Deriv Bot allows setting profit and loss thresholds to manage risk. A profit threshold will automatically stop trading after reaching a preset amount to lock your profits. A loss threshold will stop trading after accumulating a preset loss amount. These thresholds secure profits and limit losses as part of your risk management. For example, with a $10 profit threshold, the bot will stop after exceeding $10 in total profit.'
    //         />
    //     ),
    // },
    // {
    //     title: <Localize key={0} i18n_default_text='The Martingale Formula' />,
    //     content: (
    //         <>
    //             <div className='long_description__content'>
    //                 <Localize
    //                     key={0}
    //                     i18n_default_text="If you're about to start trading and haven't established a Maximum Stake as part of your risk management strategy, you can determine how long your funds will last by employing the Martingale strategy. Simply use this formula."
    //                 />
    //             </div>
    //             <div className='long_description__content'>
    //                 <Localize key={0} i18n_default_text='R = log(B/s) / log(m)' />
    //             </div>
    //             <div>
    //                 <Localize key={0} i18n_default_text='Where:' />
    //             </div>
    //             <div>
    //                 <Localize
    //                     key={0}
    //                     i18n_default_text='R represents the number of rounds a trader can sustain given a specific loss threshold.'
    //                 />
    //             </div>
    //             <div>
    //                 <Localize key={0} i18n_default_text='B is the loss threshold.' />
    //             </div>
    //             <div>
    //                 <Localize key={0} i18n_default_text='s is the initial stake.' />
    //             </div>
    //             <div className='long_description__content'>
    //                 <Localize key={0} i18n_default_text='m is the Martingale multiplier.' />
    //             </div>
    //             <div className='long_description__content'>
    //                 <Localize
    //                     key={0}
    //                     i18n_default_text='For instance, if a trader sets the loss threshold (B) is $1000, initial stake (s) is $1, and the Martingale multiplier (m) is 2, the calculation would be as follows:'
    //                 />
    //             </div>
    //             <div className='long_description__content'>
    //                 <Localize key={0} i18n_default_text='R = log(1000/1) / log(2)' />
    //             </div>
    //             <div className='long_description__content'>
    //                 <Localize key={0} i18n_default_text='R ≈ 9.965' />
    //             </div>
    //             <div className='long_description__content'>
    //                 <Localize
    //                     key={0}
    //                     i18n_default_text='This means that after 10 rounds of consecutive losses, this trader will lose $1023 which exceeds the loss threshold of $1000, stopping the bot.'
    //                 />
    //             </div>
    //             <div>
    //                 <Localize
    //                     key={0}
    //                     i18n_default_text='This formula allows you to work backwards based on your available capital and risk tolerance. Determine the Loss Threshold and Initial Stake, which will automatically calculate the number of rounds you can trade. This will give you an insight on stake sizing and expectations.'
    //                 />
    //             </div>
    //         </>
    //     ),
    // },
    // {
    //     title: <Localize key={0} i18n_default_text='Summary' />,
    //     content: (
    //         <Localize
    //             key={0}
    //             i18n_default_text="The Martingale strategy in trading may offer substantial gains but also comes with significant risks. With your selected strategy, Deriv Bot provides automated trading with risk management measures like setting initial stake, stake size, maximum stake, profit threshold and loss threshold. It's crucial for traders to assess their risk tolerance, practice in a demo account, and understand the strategy before trading with real money."
    //         />
    //     ),
    // },
    // {
    //     title: <Localize key={0} i18n_default_text='IMPORTANT:' />,
    //     content: (
    //         <Localize
    //             key={0}
    //             i18n_default_text='Please be aware that while we may use rounded figures for illustration, a stake of a specific amount does not guarantee an exact amount in successful trades. For example, a $1 stake does not necessarily equate to a $1 profit in successful trades. Trading inherently involves risks, and actual profits can fluctuate due to various factors, including market volatility and other unforeseen variables. As such, exercise caution and conduct thorough research before engaging in any trading activities.'
    //         />
    //     ),
    // },
    // {
    //     title: <Localize key={0} i18n_default_text='Disclaimer:' />,
    //     content: (
    //         <Localize
    //             key={0}
    //             i18n_default_text='The information contained in this blog article is for educational purposes only and is not intended as financial or investment advice.'
    //         />
    //     ),
    // },
];
