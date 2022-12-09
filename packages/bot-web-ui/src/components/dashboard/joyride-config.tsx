import React from 'react';
import { Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { CallBackProps } from 'react-joyride';
import { storeSetting, getSetting } from '../../utils/settings';
import TourGuide from './tour-guide';
import { getImageLocation } from '../../public-path';

type TJoyrideConfig = Record<'showProgress' | 'spotlightClicks' | 'disableBeacon' | 'disableOverlay', boolean>;

type TStep = {
    label?: string;
    content: string[];
};

type TTourStatus = {
    key: string;
    toggle: string;
    type: string;
};

type TTourType = Pick<TTourStatus, 'key'>;

export const setTourSettings = (param: number | { [key: string]: string }, type: string) => {
    if (type === `${tour_type.key}_token`) {
        return storeSetting(`${tour_type.key}_token`, param);
    }
    return storeSetting(`${tour_type.key}_status`, param);
};

export const getTourSettings = (type: string) => {
    if (type === 'token') {
        return getSetting(`${tour_type.key}_token`);
    }
    return getSetting(`${tour_type.key}_status`);
};

export const Step = ({ label, content }: TStep) => {
    return (
        <div className='db-tour'>
            <Text line_height='xl' as='p' weight='bold'>
                {label}
            </Text>
            {content.map(item => (
                <Text key={item} line_height='xl' as='p' dangerouslySetInnerHTML={{ __html: item }} />
            ))}
        </div>
    );
};

export const tour_type: TTourType = {
    key: 'onboard_tour',
};

export const setTourType = (param: string) => {
    tour_type.key = param;
};

export const tour_status_ended: TTourStatus = {
    key: '',
    toggle: '',
    type: `${tour_type.key}_status`,
};

let tour: { [key: string]: string } = {};
let current_target: number | undefined;
export const handleJoyrideCallback = (data: CallBackProps) => {
    const { action, index, status } = data;
    if (status === 'finished') {
        tour_status_ended.key = status;
    }
    if (action === 'close') {
        tour_status_ended.toggle = action;
    }
    if (current_target !== index) {
        tour = {};
        tour.status = status;
        tour.action = action;
    }
    current_target = index;
    setTourSettings(tour, 'tour');
    //added trigger to create new listner on local storage
    window.dispatchEvent(new Event('storage'));
    setTourSettings(new Date().getTime(), `${tour_type.key}_token`);
};

const joyride_props: TJoyrideConfig = {
    showProgress: false,
    spotlightClicks: true,
    disableBeacon: true,
    disableOverlay: false,
};

export const DBOT_ONBOARDING = [
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
                dashboard_tab_index={0}
                step_index={1}
            />
        ),
        ...joyride_props,
    },
    {
        target: '#id-quick-strategy',
        content: (
            <TourGuide
                label={localize('Start with a template')}
                content={[
                    localize(
                        "Load a template containing the Martingale, D'Alembert, or Oscar's Grind strategy, and modify it as you wish."
                    ),
                ]}
                img={getImageLocation('ic-new-user-step-three.png')}
                dashboard_tab_index={0}
                step_index={2}
            />
        ),
        ...joyride_props,
    },
    {
        target: '#id-charts',
        content: (
            <TourGuide
                label={localize('Monitor the market')}
                content={[localize('View the market price of your favourite assets.')]}
                img={getImageLocation('ic-new-user-step-four.png')}
                dashboard_tab_index={0}
                step_index={3}
            />
        ),
        ...joyride_props,
    },
    {
        target: '#id-tutorials',
        content: (
            <TourGuide
                label={localize('Guides and FAQs to help you')}
                content={[localize('Start with a video guide and the FAQs.')]}
                img={getImageLocation('ic-new-user-step-five.png')}
                dashboard_tab_index={0}
                step_index={4}
            />
        ),
        ...joyride_props,
    },
    {
        target: '#tab__dashboard__table__tiles',
        content: (
            <TourGuide
                label={localize('Shortcuts')}
                content={[localize('You can also use these shortcuts to import or build your bot.')]}
                dashboard_tab_index={0}
                step_index={5}
            />
        ),
        placement: 'right',
        ...joyride_props,
    },
    {
        target: '[data-testid="drawer"]',
        content: (
            <TourGuide
                label={localize('How is my bot doing?')}
                content={[localize("See your bot's performance in real-time.")]}
                img={getImageLocation('ic-new-user-step-six.png')}
                dashboard_tab_index={0}
                step_index={6}
            />
        ),
        placement: 'left',
        ...joyride_props,
    },
    {
        target: '.animation__wrapper',
        content: (
            <TourGuide
                label={localize('Run or stop your bot')}
                content={[localize('Click Run when you want to start trading, and click Stop when you want to stop.')]}
                img={getImageLocation('ic-new-user-step-seven.png')}
                dashboard_tab_index={0}
                step_index={7}
            />
        ),
        locale: { last: localize('Next') },
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
        placement: 'right',
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
        placement: 'right',
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
        placement: 'right',
        ...joyride_props,
    },
    {
        target: '.db-toolbox__row:nth-child(6)',
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
        placement: 'right',
        ...joyride_props,
    },
    {
        target: '.db-toolbox__row:nth-child(5)',
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
        placement: 'right',
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
        locale: { last: localize('Next') },
        ...joyride_props,
    },
];
