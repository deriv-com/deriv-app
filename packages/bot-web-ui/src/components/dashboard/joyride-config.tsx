import React from 'react';
import { localize } from '@deriv/translations';
import { storeSetting, getSetting } from '../../utils/settings';
import { Text, Localize, Icon } from '@deriv/components';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';

export const setJoyRideToken = () => {
    return storeSetting('joyride_trigger', new Date().getTime());
};

export const getJoyrideToken = () => {
    return getSetting('joyride_trigger');
};

export const handleJoyrideCallback = () => {
    //const { action, index, status, type } = data;

    //if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
    // Update state to advance the tour
    // this.setState({ stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) });
    //} else if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
    // Need to set our running state to false, so we can restart if we click start again.
    //this.setState({ run: false });
    //}
    const getJoyrideTokenSettings = getJoyrideToken();
    if (!getJoyrideTokenSettings) setJoyRideToken();
};

type TJoyrideProps = Record<'showProgress' | 'showSkipButton' | 'spotlightClicks' | 'disableBeacon', boolean>;
type TTourGuide = {
    Label: string | boolean;
    Content: string[];
    img?: string;
};

const TourGuide = ({ Label, Content, img }: TTourGuide) => {
    return (
        <div>
            <div
                style={{
                    textAlign: 'left',
                }}
            >
                <Text as='h' align='left' size='s' line_height='l' weight='bold' className='intial_bot_tour'>
                    {Label}
                </Text>
            </div>
            <div>
                <Icon icon={img} width='8rem' height='8rem' />
            </div>
            <div
                style={{
                    textAlign: 'left',
                }}
            >
                <Text
                    as='h'
                    align='left'
                    size='xs'
                    line_height='l'
                    className='load-strategy__google-drive-text-content'
                >
                    {Content}
                </Text>
            </div>
        </div>
    );
};
const joyride_props: TJoyrideProps = {
    showProgress: true,
    showSkipButton: true,
    spotlightClicks: true,
    disableBeacon: true,
};

export const DBOT_ONBOARDING = [
    {
        target: 'body',
        content: (
            <TourGuide
                Label={localize('Get started on DBot')}
                Content={localize('Hi [first name]! Hit Start for a quick tour to help you get started.')}
            />
        ),
        ...joyride_props,
    },
    {
        target: '#id-bot-builder',
        content: (
            <TourGuide
                Label={localize('Build from scratch')}
                Content={[
                    localize('Build your bot using drag-and-drop blocks according to your ideal trading strategy.'),
                    localize(
                        'We also provide a tutorial on this tab to show you how you can build and execute a simple strategy .'
                    ),
                ]}
                img='IcIntroBotBuilderStep2'
            />
        ),
        ...joyride_props,
    },
    {
        target: '#id-quick-strategy',
        content: (
            <TourGuide
                Label={localize('Start with a template')}
                Content={localize(
                    'Load a template containing the Martingale, D’Alembert, or Oscar’s Grind strategy, and modify it as you wish.'
                )}
                img='IcIntroBotBuilderStep3'
            />
        ),
        ...joyride_props,
    },
    {
        target: '#id-charts',
        content: (
            <TourGuide
                Label={localize('Monitor the market')}
                Content={localize('View the market price of your favourite assets.')}
                img='IcIntroBotBuilderStep4'
            />
        ),
        ...joyride_props,
    },
    {
        target: '#id-tutorials',
        content: (
            <TourGuide
                Label={localize('Start with a tutorials')}
                Content={localize(
                    'Load a template containing the Martingale, D’Alembert, or Oscar’s Grind strategy, and modify it as you wish.'
                )}
                img='IcIntroBotBuilderStep5'
            />
        ),
        ...joyride_props,
    },
    {
        target: '#dc-tabs__content_group_tiles',
        content: (
            <TourGuide
                Label={localize('Shortcuts')}
                Content={localize('You can also use these shortcuts to import or build your bot.')}
            />
        ),
        ...joyride_props,
    },
    {
        target: '[data-testid="drawer"]',
        content: (
            <TourGuide
                Label={localize('How is my bot doing?')}
                Content={localize("See your bot's performance in real-time.")}
                img='IcIntroBotBuilderStep7'
            />
        ),
        ...joyride_props,
    },
    {
        target: '.animation__wrapper toolbar__animation',
        content: (
            <TourGuide
                Label={localize('Run or stop your bot')}
                Content={localize('Click Run when you want to start trading, and click Stop when you want to stop.')}
                img='IcIntroBotBuilderStep8'
            />
        ),
        ...joyride_props,
    },
    {
        target: 'body',
        content: (
            <TourGuide
                Label={localize('Want to take retake the tour?')}
                Content={localize('If yes, go to Tutorials.')}
            />
        ),
        ...joyride_props,
    },
];
