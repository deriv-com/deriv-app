import { getImageLocation } from '../../public-path';
import React from 'react';
import { CallBackProps } from 'react-joyride';
import { Icon, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { getSetting, storeSetting } from '../../utils/settings';
import TourGuide from './tour-guide';

type TJoyrideConfig = Record<
    'showProgress' | 'spotlightClicks' | 'disableBeacon' | 'disableOverlay' | 'disableCloseOnEsc',
    boolean
>;

type TStep = {
    label?: string;
    content: Array<string | React.ReactElement>;
    type?: 'list' | 'text';
};

type TTourStatus = {
    key: string;
    toggle: string;
    type: string;
};

export type TTourType = Pick<TTourStatus, 'key'>;

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
            {content.map(item => item)}
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
    spotlightClicks: false,
    disableBeacon: true,
    disableOverlay: true,
    disableCloseOnEsc: true,
};

export const DBOT_ONBOARDING = [
    {
        target: '#id-bot-builder',
        content: (
            <TourGuide
                label={localize('Build from scratch')}
                content={[
                    localize(
                        'Create your bot easily using our drag-and-drop blocks to match your desired trading strategy, or choose from our pre-made Quick Strategies.'
                    ),
                    localize(
                        'We also provide a tutorial on this tab to show you how you can build and execute a simple strategy.'
                    ),
                ]}
                img={getImageLocation('dbot-onboarding-tour-step-1.gif')}
                dashboard_tab_index={0}
                step_index={1}
            />
        ),
        ...joyride_props,
        disableOverlay: false,
    },
    {
        target: '#id-charts',
        content: (
            <TourGuide
                label={localize('Monitor the market')}
                content={[localize('View the market price of your favourite assets.')]}
                img={getImageLocation('dbot-onboarding-tour-step-2.gif')}
                dashboard_tab_index={0}
                step_index={2}
            />
        ),
        ...joyride_props,
        disableOverlay: false,
    },
    {
        target: '#id-tutorials',
        content: (
            <TourGuide
                label={localize('Guides and FAQs to help you')}
                content={[localize('Start with a video guide and the FAQs.')]}
                img={getImageLocation('dbot-onboarding-tour-step-3.gif')}
                dashboard_tab_index={0}
                step_index={3}
            />
        ),
        ...joyride_props,
        disableOverlay: false,
    },
    {
        target: '#tab__dashboard__table__tiles',
        content: (
            <TourGuide
                label={localize('Shortcuts')}
                content={[localize('You can also use these shortcuts to import or build your bot.')]}
                dashboard_tab_index={0}
                step_index={4}
            />
        ),
        placement: 'right',
        ...joyride_props,
        disableOverlay: false,
    },
    {
        target: '[data-testid="drawer"]',
        content: (
            <TourGuide
                label={localize('How is my bot doing?')}
                content={[localize("See your bot's performance in real-time.")]}
                img={getImageLocation('dbot-onboarding-tour-step-5.gif')}
                dashboard_tab_index={0}
                step_index={5}
            />
        ),
        placement: 'left',
        ...joyride_props,
        disableOverlay: false,
    },
    {
        target: '.animation__wrapper',
        content: (
            <TourGuide
                label={localize('Run or stop your bot')}
                content={[localize('Click Run when you want to start trading, and click Stop when you want to stop.')]}
                img={getImageLocation('dbot-onboarding-tour-step-6.gif')}
                dashboard_tab_index={0}
                step_index={6}
            />
        ),
        locale: { last: localize('Next') },
        ...joyride_props,
        disableOverlay: false,
    },
];

const Step1 = ({ show_label = false }) => (
    <div className='joyride-content'>
        {show_label && (
            <div className='joyride-content__left'>
                <Localize i18n_default_text='Step 1 :' />
            </div>
        )}
        <div className='joyride-content__left'>
            <Localize
                i18n_default_text={`First, set the <0>Trade parameters</0> block.`}
                components={[<strong key={0} />]}
            />
        </div>
        <div className='joyride-content__left joyride-content__sub-title'>
            <Localize i18n_default_text='<0>1. Trade parameters:<0>' components={[<strong key={0} />]} />
        </div>
        <div className='joyride-content__left'>
            <ul>
                <li>
                    <Localize
                        i18n_default_text='First, set <0>Market</0> to Derived > Continuous Indices > Volatility 100 (1s) Index.'
                        components={[<strong key={0} />]}
                    />
                </li>
                <li>
                    <Localize
                        i18n_default_text='Then, set <0>Trade type</0> to Up/Down > Rise/Fall.'
                        components={[<strong key={0} />]}
                    />
                </li>
                <li>
                    <Localize
                        i18n_default_text='For <0>Contract type,</0> set it to Both.'
                        components={[<strong key={0} />]}
                    />
                </li>
                <li>
                    <Localize
                        i18n_default_text='For <0>Default candle interval,</0> set it to 1 minute'
                        components={[<strong key={0} />]}
                    />
                </li>
            </ul>
        </div>
    </div>
);

const Step1A = () => (
    <div className='joyride-content'>
        <div className='joyride-content__left'>
            <Localize
                i18n_default_text='For <0>Trade options</0>, set it as below:'
                components={[<strong key={0} />]}
            />
        </div>
        <div className='joyride-content__left'>
            <ul>
                <li>
                    <Localize i18n_default_text='<0>Duration</0>: Ticks 1' components={[<strong key={0} />]} />
                </li>
                <li>
                    <Localize
                        i18n_default_text='<0>Stake: USD</0> 10 (min: 0.35 - max: 50000)'
                        components={[<strong key={0} />]}
                    />
                </li>
            </ul>
        </div>
    </div>
);

const Step2 = ({ show_label = false }) => (
    <div className='joyride-content'>
        {show_label && (
            <div className='joyride-content__left'>
                <Localize i18n_default_text='Step 2 :' />
            </div>
        )}

        <div className='joyride-content__left'>
            <Localize
                i18n_default_text='Then, set the <0>Purchase conditions</0> block.'
                components={[<strong key={0} />]}
            />
        </div>
        <div className='joyride-content__left joyride-content__sub-title'>
            <Localize i18n_default_text='<0>2. Purchase conditions</0>:' components={[<strong key={0} />]} />
        </div>
        <div className='joyride-content__left'>
            <ul>
                <li>
                    <Localize i18n_default_text='<0>Purchase</0>: Rise' components={[<strong key={0} />]} />
                </li>
            </ul>
        </div>
    </div>
);

const Step3 = ({ show_label = false }) => (
    <div className='joyride-content'>
        {show_label && (
            <div className='joyride-content__left joyride-content__left__step-three'>
                <Localize i18n_default_text='Step 3 :' />
            </div>
        )}

        <div className='joyride-content__left'>
            <Localize
                i18n_default_text='The third block is <0>optional</0>. You may use this block if you want to sell your contract before it expires. For now, leave the block as it is. '
                components={[<strong key={0} />]}
            />
        </div>
    </div>
);

const Step4 = ({ show_label = false }) => (
    <div className='joyride-content'>
        {show_label && (
            <div className='joyride-content__left'>
                <Localize i18n_default_text='Step 4 :' />
            </div>
        )}

        <div className='joyride-content__left'>
            <Localize
                i18n_default_text='Next, go to <0>Utility tab</0> under the Blocks menu. Tap the drop-down arrow and hit <0>Loops</0>.'
                components={[<strong key={0} />]}
            />
        </div>
        <div className='joyride-content__left'>
            <ul>
                <li>
                    <Localize
                        i18n_default_text='Look for the <0>Repeat While/Until</0>, and click the + icon to add the block to the workspace area.'
                        components={[<strong key={0} />]}
                    />
                </li>
                <li>
                    <Localize
                        i18n_default_text='Choose <0>until</0> as the repeat option.'
                        components={[<strong key={0} />]}
                    />
                </li>
            </ul>
            <div className='joyride-content__left joyride-content__with-icon'>
                <div className='joyride-content__with-icon__left'>
                    <Icon icon='IcCheckmarkCircle' className='db-contract-card__result-icon' color='green' />
                </div>
                <div className='joyride-content__with-icon__right'>
                    <Localize
                        i18n_default_text='Pro tip: You can also click and drag out the desired block'
                        components={[<strong key={0} />]}
                    />
                </div>
            </div>
        </div>
        <div>
            <img src={getImageLocation('bot-builder-tour-step-4.gif')} alt='step4' />
        </div>
    </div>
);

const Step5 = ({ show_label = false }) => (
    <div className='joyride-content'>
        {show_label && (
            <div className='joyride-content__left'>
                <Localize i18n_default_text='Step 5 :' />
            </div>
        )}

        <div className='joyride-content__left'>
            <Localize
                i18n_default_text='Now, tap the <0>Analysis</0> drop-down arrow and hit <0>Contract</0>.'
                components={[<strong key={0} />]}
            />
        </div>
        <div className='joyride-content__left'>
            <ul>
                <li>
                    <Localize
                        i18n_default_text='Go to the <0>Last trade result</0> block and click + icon to add the <0>Result is Win</0> block to the workspace.'
                        components={[<strong key={0} />]}
                    />
                </li>
                <li>
                    <Localize
                        i18n_default_text='Then, drag the <0>Result is win</0> into the empty slot next to <0>repeat until</0> block.'
                        components={[<strong key={0} />]}
                    />
                </li>
                <li>
                    <Localize
                        i18n_default_text='Now, go to the <0>Restart trading conditions</0> block.'
                        components={[<strong key={0} />]}
                    />
                </li>
                <li>
                    <Localize
                        i18n_default_text='Drag the <0>Trade again</0> block and add it into the <0>do</0> part of the <0>Repeat until</0> block.'
                        components={[<strong key={0} />]}
                    />
                </li>
            </ul>
        </div>
        <div>
            <img src={getImageLocation('bot-builder-tour-step-5.gif')} alt='step5' />
        </div>
    </div>
);

const Step6 = ({ show_label = false }) => (
    <div className='joyride-content'>
        {show_label && (
            <div className='joyride-content__left'>
                <Localize i18n_default_text='Step 6 :' />
            </div>
        )}

        <div className='joyride-content__left'>
            <Localize
                i18n_default_text='Finally, drag and add the whole <0>Repeat</0> block to the <0>Restart trading conditions</0> block.'
                components={[<strong key={0} />]}
            />
        </div>
    </div>
);

export const BOT_BUILDER_TOUR = [
    {
        target: '.animation__wrapper',
        content: <Step1 show_label />,
        placement: 'right',
        ...joyride_props,
    },
    {
        target: '.animation__wrapper',
        content: <Step1A />,
        placement: 'bottom',
        ...joyride_props,
    },
    {
        target: '.animation__wrapper',
        content: <Step2 show_label />,
        placement: 'right',
        ...joyride_props,
    },
    {
        target: '.animation__wrapper',
        content: <Step3 show_label />,
        placement: 'right',
        ...joyride_props,
    },
    {
        target: '.animation__wrapper',
        content: <Step4 show_label />,
        placement: 'right',
        ...joyride_props,
    },
    {
        target: '.animation__wrapper',
        content: <Step5 show_label />,
        placement: 'right',
        ...joyride_props,
    },
    {
        target: '.animation__wrapper',
        content: <Step6 show_label />,
        locale: { last: localize('Next') },
        ...joyride_props,
    },
];

export type TStepMobile = {
    header: string;
    content: React.ReactElement;
    key: number;
};

export const BOT_BUILDER_MOBILE: TStepMobile[] = [
    {
        header: localize('Step 1'),
        content: <Localize i18n_default_text={`First, click the Import icon on the tool bar.`} />,
        key: 1,
    },
    {
        header: localize('Step 2'),
        content: (
            <Localize
                i18n_default_text={`Next, import your bot directly from your mobile device or from Google Drive.`}
            />
        ),
        key: 2,
    },
    {
        header: localize('Step 3'),
        content: (
            <Localize
                i18n_default_text={`Once imported, you will see a preview of the bot on the workspace. Click run to start trading with this bot.`}
            />
        ),
        key: 3,
    },
];

export const DBOT_ONBOARDING_MOBILE = [
    {
        header: localize('Get started on DBot'),
        content: [
            <Localize
                key='get-started=mobile'
                i18n_default_text='Hi! Hit <0>Start</0> for a quick tour to help you get started.'
                components={[<strong key={0} />]}
            />,
        ],
        key: 1,
        step_key: 0,
    },
    {
        header: localize('Build from scratch'),
        img: getImageLocation('dbot-mobile-onboarding-step-1.gif'),
        content: [
            localize(
                'Import a bot from your mobile device or from Google drive, see a preview in the bot builder, and start trading by running the bot, or choose from our pre-made Quick Strategies. '
            ),
        ],
        key: 2,
        step_key: 1,
    },
    {
        header: localize('Monitor the market'),
        img: getImageLocation('dbot-mobile-onboarding-step-2.png'),
        content: [localize('View the market price of your favourite assets.')],
        key: 3,
        step_key: 2,
    },
    {
        header: localize('Guides and FAQs to help you'),
        img: getImageLocation('dbot-mobile-onboarding-step-3.gif'),
        content: [localize('Start with a video guide and the FAQs.')],
        key: 4,
        step_key: 3,
    },
    {
        header: localize('Shortcuts'),
        img: getImageLocation('dbot-mobile-onboarding-step-4.png'),
        content: [localize('You can also use these shortcuts to import or build your bot.')],
        key: 5,
        step_key: 4,
    },
    {
        header: localize('How is my bot doing?'),
        img: getImageLocation('dbot-mobile-onboarding-step-5.gif'),
        content: [localize("See your bot's performance in real-time.")],
        key: 6,
        step_key: 5,
    },
    {
        header: localize('Run or stop your bot'),
        img: getImageLocation('dbot-mobile-onboarding-step-6.gif'),
        content: [localize('Click Run when you want to start trading, and click Stop when you want to stop.')],
        key: 7,
        step_key: 6,
    },
];
