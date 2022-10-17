import React from 'react';
import { localize } from '@deriv/translations';
import { Text } from '@deriv/components';

type TJoyrideConfig = Record<'showProgress' | 'showSkipButton' | 'spotlightClicks' | 'disableBeacon', boolean>;

type TStep = {
    label?: string;
    content: TContent[];
};

type TContent = {
    contentData: string;
};

export const Step = ({ label, content }: TStep) => {
    return (
        <div className='db-tour' style={{}}>
            <Text line_height='xl' as='p' weight='bold' color='colored-background'>
                {label}
            </Text>
            {content.map(data => {
                const { contentData } = data;
                return (
                    <Text
                        key={contentData}
                        line_height='xl'
                        as='p'
                        color='colored-background'
                        dangerouslySetInnerHTML={{ __html: contentData }}
                    />
                );
            })}
        </div>
    );
};

/**
 * Joyride specifc config
 * It should be in camel casing.
 */
const joyride_config: TJoyrideConfig = {
    showProgress: true,
    showSkipButton: true,
    spotlightClicks: true,
    disableBeacon: true,
};

export const BOT_BUILDER_TOUR = [
    {
        target: 'body',
        content: [
            <Step
                key='Lets build a bot'
                label={localize("Let's build a bot")}
                content={[
                    {
                        contentData: localize('Learn how to build your bot from scratch using a simple strategy.'),
                    },
                    {
                        contentData: localize('Hit the Start button to begin and follow the tutorial.'),
                    },
                    {
                        contentData: localize('Note: You can also find this tutorial in the Tutorials tab.'),
                    },
                ]}
            />,
        ],
        ...joyride_config,
    },
    {
        target: '[data-category="trade_parameters"]',
        content: [
            <Step
                key='Step 1'
                content={[
                    {
                        contentData: localize('Step 1:'),
                    },
                    {
                        contentData: localize('First, set the <strong>Trade parameters</strong> block.'),
                    },
                    {
                        contentData: localize('<strong>1. Trade Parameters</strong>:'),
                    },
                    {
                        contentData: localize(
                            '- <strong>Market</strong>: Synthetic Indices > Continuous Indices > Volatility 100 (1s) Index'
                        ),
                    },
                    {
                        contentData: localize('- <strong>Trade Type</strong>: Up/Down > Rise/Fall'),
                    },
                    {
                        contentData: localize('- <strong>Contract type</strong>: Both'),
                    },
                ]}
            />,
        ],
        ...joyride_config,
    },
    {
        target: '[data-category="trade_parameters"]',
        content: [
            <Step
                key='trade_parameters'
                content={[
                    {
                        contentData: localize('For <strong>Trade options</strong>, set it as below:'),
                    },
                    {
                        contentData: localize('- <strong>Duration</strong>: Ticks 1'),
                    },
                    {
                        contentData: localize('- <strong>Stake: USD</strong> 10 (min: 0.35 - max: 50000)'),
                    },
                ]}
            />,
        ],
        ...joyride_config,
    },
    {
        target: '[data-category="purchase_conditions"]',
        content: [
            <Step
                key='purchase_conditions'
                content={[
                    {
                        contentData: localize('Step 2:'),
                    },
                    {
                        contentData: localize('Then, set the <strong>Purchase conditions</strong> block.'),
                    },
                    {
                        contentData: localize('<strong>2. Purchase conditions</strong>:'),
                    },
                    {
                        contentData: localize('- <strong>Purchase</strong>: Rise'),
                    },
                ]}
            />,
        ],
        ...joyride_config,
    },
    {
        target: '[data-category="sell_conditions"]',
        content: [
            <Step
                key='sell_conditions'
                content={[
                    {
                        contentData: localize('Step 3:'),
                    },
                    {
                        contentData: localize(
                            'The third block is <strong>optional</strong>. You may use this block if you want to sell your contract before it expires. For now, lets leave the block as it is.'
                        ),
                    },
                ]}
            />,
        ],
        ...joyride_config,
    },
    {
        target: '.dashboard__toolbox',
        content: [
            <Step
                key='toolbox'
                content={[
                    {
                        contentData: localize('Step 4:'),
                    },
                    {
                        contentData: localize(
                            'Next, go to <strong>Utility tab</strong> under the Blocks menu. Tap the drop-down arrow and hit <strong>Loops</strong>'
                        ),
                    },
                    {
                        contentData: localize(
                            '- Look for the <strong>Repeat While/Until</strong>, and click the + icon to add the block to the workspace area.'
                        ),
                    },
                    {
                        contentData: localize('- Choose <strong>until</strong> as the repeat option.'),
                    },
                    {
                        contentData: localize('Pro tip: You can also drag out the desired block'),
                    },
                ]}
            />,
        ],
        ...joyride_config,
    },
    {
        target: '.dashboard__toolbox',
        content: [
            <Step
                key='dashboard__toolbox'
                content={[
                    {
                        contentData: localize('Step 5:'),
                    },
                    {
                        contentData: localize(
                            'Now, tap the <strong>Analysis</strong> drop-down arrow and hit <strong>Contract</strong>.'
                        ),
                    },
                    {
                        contentData: localize(
                            '- Go to the <strong>Last trade result</strong> block and click + icon to add the <strong>Result is Win</strong> block to the workspace.'
                        ),
                    },
                    {
                        contentData: localize(
                            '- Then, drag the <strong>Result is win</strong> next to the <strong>repeat until</strong> block.'
                        ),
                    },
                    {
                        contentData: localize('- Now, go to the <strong>Restart trading conditions</strong> block.'),
                    },
                    {
                        contentData: localize(
                            '- Drag the <strong>Trade again</strong> block and add it next to the <strong>do</strong> part of the <strong>Repeat until</strong> block.'
                        ),
                    },
                ]}
            />,
        ],
        ...joyride_config,
    },
    {
        target: '[data-category="trade_results"]',
        content: [
            <Step
                key='trade_results'
                content={[
                    {
                        contentData: localize('Step 6:'),
                    },
                    {
                        contentData: localize(
                            'Finally, drag and add the whole <strong>Repeat</strong> block to the <strong>Restart trading conditions</strong> block.'
                        ),
                    },
                ]}
            />,
        ],
        ...joyride_config,
    },
    {
        target: 'body',
        content: [
            <Step
                key='Congratulations'
                label={localize('Congratulations')}
                content={[
                    {
                        contentData: localize('You have successfully created your bot using a simple strategy.'),
                    },
                    {
                        contentData: localize('Now, <strong>run the bot</strong> to test out the strategy.'),
                    },
                    {
                        contentData: localize(
                            'Note: If you wish to learn more about the Bot Builder, you can proceed to the <strong>Tutorials</strong> tab.'
                        ),
                    },
                ]}
            />,
        ],
        ...joyride_config,
    },
];
