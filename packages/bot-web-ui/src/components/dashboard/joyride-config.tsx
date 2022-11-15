import React from 'react';
import { localize } from '@deriv/translations';
import { storeSetting, getSetting } from '../../utils/settings';
import TourGuide from './tour-guide';
import { CallBackProps } from 'react-joyride';
import { Text } from '@deriv/components';
import { getImageLocation } from '../../public-path';

type TJoyrideConfig = Record<'showProgress' | 'spotlightClicks' | 'disableBeacon' | 'disableOverlay', boolean>;

type TStep = {
    label?: string;
    content: string[];
};

export const setTourSettings = (param: number | { [key: string]: string }, type: string) => {
    if (type === `${tour_type.key}token`) {
        return storeSetting(`${tour_type.key}token`, param);
    }
    return storeSetting(`${tour_type.key}status`, param);
};

export const getTourSettings = (type: string) => {
    if (type === 'token') {
        return getSetting(`${tour_type.key}token`);
    }
    return getSetting(`${tour_type.key}status`);
};

export const Step = ({ label, content }: TStep) => {
    return (
        <div className='db-tour'>
            <Text line_height='xl' as='p' weight='bold' color='var(--text-joyride-tour)'>
                {label}
            </Text>
            {content.map(item => (
                <Text
                    key={item}
                    line_height='xl'
                    as='p'
                    color='var(--text-joyride-tour)'
                    dangerouslySetInnerHTML={{ __html: item }}
                />
            ))}
        </div>
    );
};

export const tour_type = {
    key: 'onboard_tour_',
};

export const setTourType = (param: string) => {
    tour_type.key = param;
};

export const tour_status_ended = {
    key: '',
    type: `${tour_type.key}status`,
};

let tour: { [key: string]: string } = {};
let current_target: number;
export const handleJoyrideCallback = (data: CallBackProps) => {
    const { action, index, status, type } = data;
    if (status === 'finished') {
        tour_status_ended.key = status;
    }
    if (current_target && current_target !== index) {
        tour = {};
        tour.status = status;
        tour.action = action;
    }
    current_target = index;
    setTourSettings(tour, 'tour');
    //added trigger to create new listner on local storage
    window.dispatchEvent(new Event('storage'));
    if (!getTourSettings(`${tour_type.key}token`)) setTourSettings(new Date().getTime(), `${tour_type.key}token`);
};

const joyride_props: TJoyrideConfig = {
    showProgress: false,
    spotlightClicks: true,
    disableBeacon: true,
    disableOverlay: true,
};

export const DBOT_ONBOARDING = [
    {
        target: '#tab__dashboard__table__tiles',
        content: (
            <TourGuide
                label={localize('Shortcuts')}
                content={localize('You can also use these shortcuts to import or build your bot.')}
                className={'dbot-onboarding__container'}
                dashboardTabIndex={0}
            />
        ),
        ...joyride_props,
    },
    {
        target: '#id-bot-builder',
        content: (
            <TourGuide
                label={localize('Build from scratch')}
                content={[
                    localize('Build your bot using drag-and-drop blocks according to your ideal trading strategy.'),
                    localize(
                        'We also provide a tutorial on this tab to show you how you can build and execute a simple strategy .'
                    ),
                ]}
                img={getImageLocation('ic-new-user-step-two.png')}
                className={'dbot-onboarding__container'}
                dashboardTabIndex={1}
            />
        ),
        ...joyride_props,
    },
    {
        target: '#id-quick-strategy',
        content: (
            <TourGuide
                label={localize('Start with a template')}
                content={localize(
                    "Load a template containing the Martingale, D'Alembert, or Oscar's Grind strategy, and modify it as you wish."
                )}
                img={getImageLocation('ic-new-user-step-three.png')}
                className={'dbot-onboarding__container'}
                dashboardTabIndex={2}
            />
        ),
        ...joyride_props,
    },
    {
        target: '#id-charts',
        content: (
            <TourGuide
                label={localize('Monitor the market')}
                content={localize('View the market price of your favourite assets.')}
                img={getImageLocation('ic-new-user-step-four.png')}
                className={'dbot-onboarding__container'}
                dashboardTabIndex={3}
            />
        ),
        ...joyride_props,
    },
    {
        target: '#id-tutorials',
        content: (
            <TourGuide
                label={localize('Start with a tutorials')}
                content={localize(
                    "Load a template containing the Martingale, D'Alembert, or Oscar's Grind strategy, and modify it as you wish."
                )}
                img={getImageLocation('ic-new-user-step-five.png')}
                className={'dbot-onboarding__container'}
                dashboardTabIndex={4}
            />
        ),
        ...joyride_props,
    },
    {
        target: '.animation__wrapper',
        content: (
            <TourGuide
                label={localize('Run or stop your bot')}
                content={localize('Click Run when you want to start trading, and click Stop when you want to stop.')}
                img={getImageLocation('ic-new-user-step-seven.png')}
                className={'dbot-onboarding__container'}
                dashboardTabIndex={1}
            />
        ),
        ...joyride_props,
    },
    {
        target: '[data-testid="drawer"]',
        content: (
            <TourGuide
                label={localize('How is my bot doing?')}
                content={localize("See your bot's performance in real-time.")}
                img={getImageLocation('ic-new-user-step-six.png')}
                className={'dbot-onboarding__container'}
                dashboardTabIndex={1}
            />
        ),
        ...joyride_props,
    },

    {
        target: 'body',
        content: (
            <TourGuide
                label={localize('Want to take retake the tour?')}
                content={localize('If yes, go to Tutorials.')}
                className={'dbot-onboarding__container'}
                dashboardTabIndex={0}
            />
        ),
        ...joyride_props,
    },
];
export const BOT_BUILDER_TOUR = [
    {
        target: '[data-category="trade_parameters"]',
        content: [
            <Step
                key='Step 1'
                content={[
                    localize('Step 1 :'),
                    localize('First, set the <strong>Trade parameters</strong> block.'),
                    localize('<strong>1. Trade Parameters</strong>:'),
                    localize(
                        '- <strong>Market</strong>: Synthetic Indices > Continuous Indices > Volatility 100 (1s) Index'
                    ),
                    localize('- <strong>Trade Type</strong>: Up/Down > Rise/Fall'),
                    localize('- <strong>Contract type</strong>: Both'),
                    localize('- <strong>Default candle interval</strong>: 1 minute'),
                ]}
            />,
        ],
        ...joyride_props,
    },
    {
        target: '[data-category="trade_parameters"]',
        content: [
            <Step
                key='trade_parameters'
                content={[
                    localize('For <strong>Trade options</strong>, set it as below:'),
                    localize('- <strong>Duration</strong>: Ticks 1'),
                    localize('- <strong>Stake: USD</strong> 10 (min: 0.35 - max: 50000)'),
                ]}
            />,
        ],
        ...joyride_props,
    },
    {
        target: '[data-category="purchase_conditions"]',
        content: [
            <Step
                key='purchase_conditions'
                content={[
                    localize('Step 2 :'),
                    localize('Then, set the <strong>Purchase conditions</strong> block.'),
                    localize('<strong>2. Purchase conditions</strong>:'),
                    localize('- <strong>Purchase</strong>: Rise'),
                ]}
            />,
        ],
        ...joyride_props,
    },
    {
        target: '[data-category="sell_conditions"]',
        content: [
            <Step
                key='sell_conditions'
                content={[
                    localize('Step 3 :'),
                    localize(
                        'The third block is <strong>optional</strong>. You may use this block if you want to sell your contract before it expires. For now, lets leave the block as it is.'
                    ),
                ]}
            />,
        ],
        ...joyride_props,
    },
    {
        target: '.db-toolbox__row:nth-child(5)',
        content: [
            <Step
                key='toolbox'
                content={[
                    localize('Step 4 :'),
                    localize(
                        'Next, go to <strong>Utility tab</strong> under the Blocks menu. Tap the drop-down arrow and hit <strong>Loops</strong>.'
                    ),
                    localize(
                        '- Look for the <strong>Repeat While/Until</strong>, and click the + icon to add the block to the workspace area.'
                    ),
                    localize('- Choose <strong>until</strong> as the repeat option.'),
                    localize('Pro tip: You can also drag out the desired block'),
                ]}
            />,
        ],
        ...joyride_props,
    },
    {
        target: '.db-toolbox__row:nth-child(6)',
        content: [
            <Step
                key='dashboard__toolbox'
                content={[
                    localize('Step 5 :'),
                    localize(
                        'Now, tap the <strong>Analysis</strong> drop-down arrow and hit <strong>Contract</strong>.'
                    ),
                    localize(
                        '- Go to the <strong>Last trade result</strong> block and click + icon to add the <strong>Result is Win</strong> block to the workspace.'
                    ),
                    localize(
                        '- Then, drag the <strong>Result is win</strong> next to the <strong>repeat until</strong> block.'
                    ),
                    localize('- Now, go to the <strong>Restart trading conditions</strong> block.'),
                    localize(
                        '- Drag the <strong>Trade again</strong> block and add it next to the <strong>do</strong> part of the <strong>Repeat until</strong> block.'
                    ),
                ]}
            />,
        ],
        ...joyride_props,
    },
    {
        target: '[data-category="trade_results"]',
        content: [
            <Step
                key='trade_results'
                content={[
                    localize('Step 6 :'),
                    localize(
                        'Finally, drag and add the whole <strong>Repeat</strong> block to the <strong>Restart trading conditions</strong> block.'
                    ),
                ]}
            />,
        ],
        ...joyride_props,
    },
];
