import React from 'react';
import { Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { CallBackProps } from 'react-joyride';
import { storeSetting, getSetting } from '../../utils/settings';
import TourGuide from './tour-guide';
import { getImageLocation } from '../../public-path';

type TJoyrideConfig = Record<'showProgress' | 'spotlightClicks' | 'disableBeacon' | 'disableOverlay', boolean>;

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
            <Localize
                key={0}
                components={[<strong key={0} />, <br key={1} />, <li key={2} />]}
                i18n_default_text='Step 1: <1/> First, set the <0>Trade parameters</0> block.<1/> <0>1. Trade Parameters</0><1/><2 class="list">First, set <strong>Market</strong> to Synthetic Indices > Continuous Indices > Volatility 100 (1s) Index.</2><2 class="list">Then, set <strong>Trade Type</strong> to Up/Down > Rise/Fall.</2><2 class="list">For <strong>Contract Type,</strong> set it to Both.</2><2 class="list">For <strong>Default candle interval,</strong> set it to 1 minute.</2>'
            />,
        ],
        placement: 'right',
        ...joyride_props,
    },
    {
        target: '[data-category="trade_parameters"]',
        content: [
            <Localize
                key={0}
                components={[<strong key={0} />, <br key={1} />, <li key={2} />]}
                i18n_default_text='For <0>Trade options,</0> set it as below:<1/> <2 class="list"><strong>Duration:</strong> Ticks 1</2><2 class="list"><strong>Stake: USD</strong> 10 (min: 0.35 - max: 50000)</2>'
            />,
        ],
        ...joyride_props,
    },
    {
        target: '[data-category="purchase_conditions"]',
        content: [
            <Localize
                key={0}
                components={[<strong key={0} />, <br key={1} />, <li key={2} />]}
                i18n_default_text='Step 2 :<1/> Then, set the <0>Purchase Conditions</0> block.<1/> <strong>2. Purchase Conditions:</strong><1/><2 class="list"><strong>Purchase</strong>: Rise</2>'
            />,
        ],
        placement: 'right',
        ...joyride_props,
    },
    {
        target: '[data-category="sell_conditions"]',
        content: [
            <Localize
                key={0}
                components={[<strong key={0} />, <br key={1} />, <li key={2} />]}
                i18n_default_text='Step 3 :<1/>The third block is <0>optional.</0> You may use this block if you want to sell your contract before it expires. For now, lets leave the block as it is.'
            />,
        ],
        placement: 'right',
        ...joyride_props,
    },
    {
        target: '.db-toolbox__row:nth-child(6)',
        content: [
            <Localize
                key={0}
                components={[<strong key={0} />, <br key={1} />, <li key={2} />]}
                i18n_default_text='Step 4 :<1/>Next, go to <0>Utility tab.</0> under the Blocks menu. Tap the drop-down arrow and hit <strong>Loops.</strong><1/><2 class="list">Look for the <strong>Repeat While/Until,</strong> and click the + icon to add the block to the workspace area.</2><2 class="list">Choose <strong>until</strong> as the repeat option.</2><2 class="list">Pro tip: You can also drag out the desired block.</2>'
            />,
        ],
        placement: 'right',
        ...joyride_props,
    },
    {
        target: '.db-toolbox__row:nth-child(5)',
        content: [
            <Localize
                key={0}
                components={[<strong key={0} />, <br key={1} />, <li key={2} />]}
                i18n_default_text='Step 5 :<1/>Now, tap the  <0>Analysis</0> drop-down arrow and hit <strong>Contract</strong><1/><2 class="list">Go to the <strong>Last trade result</strong> block and click + icon to add the <strong>Result is Win</strong> block to the workspace.</2><2 class="list">Then, drag the  <strong>Result is win</strong> next to the <strong>repeat until</strong> block.</2><2 class="list">Now, go to the <strong>Restart trading conditions</strong> block.</2><2 class="list">Drag the <strong>Trade again</strong> block and add it next to the <strong>do</strong> part of the <strong>Repeat until</strong> block.</2>'
            />,
        ],
        placement: 'right',
        ...joyride_props,
    },
    {
        target: '[data-category="trade_results"]',
        content: [
            <Localize
                key={0}
                components={[<strong key={0} />, <br key={1} />, <li key={2} />]}
                i18n_default_text='Step 6 :<1/>Finally, drag and add the whole <0>Repeat</0> block to the <0>Restart trading conditions</0> block.'
            />,
        ],
        placement: 'right',
        locale: { last: localize('Next') },
        ...joyride_props,
    },
];
