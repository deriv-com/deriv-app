import { getImageLocation } from '../../public-path';
import React from 'react';
import { CallBackProps } from 'react-joyride';
import { Icon, Text } from '@deriv/components';
import { getUrlBase } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { getSetting, storeSetting } from '../../utils/settings';
import TourGuide from './tour-guide';

type TJoyrideConfig = Record<
    'showProgress' | 'spotlightClicks' | 'disableBeacon' | 'disableOverlay' | 'disableCloseOnEsc',
    boolean
>;

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
                        'Create your bot using our drag-and-drop blocks or click Quick Strategy to choose from the ready-to-use bot templates.'
                    ),
                    localize(
                        'We also provide a guide on the Tutorial tab to show you how you can build and execute a simple strategy.'
                    ),
                ]}
                media={getUrlBase('/public/videos/dbot-onboarding-tour-step-1.mp4')}
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
                media={getUrlBase('/public/videos/dbot-onboarding-tour-step-2.mp4')}
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
                label={localize('Learn more with our tutorials')}
                content={[localize('Explore the video guides and FAQs to build your bot in the tutorials tab.')]}
                media={getUrlBase('/public/videos/dbot-onboarding-tour-step-3.mp4')}
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
                label={localize('Use these shortcuts')}
                content={[localize('You can also import or build your bot using any of these shortcuts.')]}
                step_index={4}
            />
        ),
        placement: 'right',
        ...joyride_props,
        disableOverlay: false,
    },
    {
        target: '.dc-drawer__container',
        content: (
            <TourGuide
                label={localize('Check your bot’s performance')}
                content={[localize('See how your bot is doing in real-time.')]}
                media={getUrlBase('/public/videos/dbot-onboarding-tour-step-5.mp4')}
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
                label={localize('Run your bot')}
                content={[
                    <Localize
                        key='run your bot'
                        i18n_default_text='Click <0>Run</0> when you want to start trading, and click <0>Stop</0> when you want to stop.'
                        components={[<strong key={0} />]}
                    />,
                ]}
                media={getUrlBase('/public/videos/dbot-onboarding-tour-step-6.mp4')}
                step_index={6}
            />
        ),
        ...joyride_props,
        disableOverlay: false,
    },
    {
        target: '#id-tutorials',
        content: (
            <TourGuide
                label={localize('Want to retake the tour?')}
                content={[
                    <Text key={`${0}-id-tutorials`} as='p'>
                        <Localize i18n_default_text={`Head to the Tutorials tab to do so.`} />
                    </Text>,
                ]}
                step_index={7}
                show_actions={false}
                has_localize_component
            />
        ),
        locale: { last: localize('Got it, thanks!') },
        ...joyride_props,
        hideBackButton: true,
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
                i18n_default_text={'First, set the <0>Trade parameters</0> block.'}
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
            <video autoPlay loop controls playsInline preload='auto' disablePictureInPicture controlsList='nodownload'>
                <source src={getUrlBase('/public/videos/bot-builder-tour-step-4.mp4')} type='video/mp4' />
            </video>
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
            <video autoPlay loop controls playsInline preload='auto' disablePictureInPicture controlsList='nodownload'>
                <source src={getUrlBase('/public/videos/bot-builder-tour-step-5.mp4')} type='video/mp4' />
            </video>
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
    content: React.ReactElement[];
    key: number;
    step_key?: number;
    img?: string;
    media?: string;
};

export const BOT_BUILDER_MOBILE: TStepMobile[] = [
    {
        header: localize('Step 1'),
        content: [<Localize key='step-1' i18n_default_text={`First, click the Import icon on the tool bar.`} />],
        key: 1,
    },
    {
        header: localize('Step 2'),
        content: [
            <Localize
                key='step-2'
                i18n_default_text={`Next, import your bot directly from your mobile device or from Google Drive.`}
            />,
        ],
        key: 2,
    },
    {
        header: localize('Step 3'),
        content: [
            <Localize
                key='step-3'
                i18n_default_text={`Once imported, you will see a preview of the bot on the workspace. Click run to start trading with this bot.`}
            />,
        ],
        key: 3,
    },
];

export const DBOT_ONBOARDING_MOBILE: TStepMobile[] = [
    {
        header: localize('Get started on Deriv Bot'),
        content: [
            <Localize
                key='get-started-on-deriv-bot'
                i18n_default_text='Hi! Hit <0>Start</0> for a quick tour.'
                components={[<strong key={0} />]}
            />,
        ],
        key: 1,
        step_key: 0,
    },
    {
        header: localize('Import or choose your bot'),
        content: [
            <Localize
                key='import-or-choose-your-bot'
                i18n_default_text='Import your bot or tap Quick Strategies to choose from the ready-to-use bot templates.'
            />,
        ],
        media: getUrlBase('/public/videos/dbot-mobile-onboarding-step-1.mp4'),
        key: 2,
        step_key: 1,
    },
    {
        header: localize('Monitor the market'),
        content: [
            <Localize key='monitor-the-market' i18n_default_text='View the market price of your favourite assets.' />,
        ],
        media: getUrlBase('/public/videos/dbot-mobile-onboarding-step-2.mp4'),
        key: 3,
        step_key: 2,
    },
    {
        header: localize('Learn more with our tutorials'),
        content: [
            <Localize
                key='learn-more-with-our-tutorials'
                i18n_default_text='Explore the video guides and FAQs to build your bot in the tutorials tab.'
            />,
        ],
        media: getUrlBase('/public/videos/dbot-mobile-onboarding-step-3.mp4'),
        key: 4,
        step_key: 3,
    },
    {
        header: localize('Use these shortcuts'),
        img: getImageLocation('dbot-mobile-onboarding-step-4.png'),
        content: [
            <Localize
                key='use-these-shortcuts'
                i18n_default_text='You can also import or build your bot using any of these shortcuts.'
            />,
        ],
        key: 5,
        step_key: 4,
    },
    {
        header: localize('Check your bot’s performance'),
        content: [
            <Localize
                key='check-bot-performance'
                i18n_default_text='See how your bot is doing in real-time.'
                components={[<strong key={0} />]}
            />,
        ],
        media: getUrlBase('/public/videos/dbot-mobile-onboarding-step-5.mp4'),
        key: 6,
        step_key: 5,
    },
    {
        header: localize('Run your bot'),
        media: getUrlBase('/public/videos/dbot-mobile-onboarding-step-6.mp4'),
        content: [
            <Localize
                key='run-your-bot'
                i18n_default_text='Click <0>Run</0> when you want to start trading, and click <0>Stop</0> when you want to stop.'
                components={[<strong key={0} />]}
            />,
        ],
        key: 7,
        step_key: 6,
    },
    {
        header: localize('Want to retake the tour?'),
        img: getImageLocation('dbot-mobile-onboarding-step-7.png'),
        content: [<Localize key='want-to-retake-the-tour' i18n_default_text='Head to the Tutorials tab to do so.' />],
        key: 8,
        step_key: 7,
    },
];
