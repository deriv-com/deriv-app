import React from 'react';
import { localize } from '@deriv/translations';
import { storeSetting, getSetting } from '../../utils/settings';
import { getUrlBase } from '@deriv/shared';
import TourGuide from './tour-guide';
import { CallBackProps } from 'react-joyride';

export const getImageLocation = (image_name: string) => getUrlBase(`/public/images/common/${image_name}`);

export const setJoyRideToken = () => {
    return storeSetting('joyride_trigger', new Date().getTime());
};

type TStep = {
    label: string;
    content: string;
};
export const getJoyrideToken = () => {
    return getSetting('joyride_trigger');
};

export const handleJoyrideCallback = (data: CallBackProps) => {
    const { action, index, status, type } = data;

    const getJoyrideTokenSettings = getJoyrideToken();
    if (!getJoyrideTokenSettings) setJoyRideToken();
};

type TJoyrideProps = Record<'showProgress' | 'showSkipButton' | 'spotlightClicks' | 'disableBeacon', boolean>;

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
                className={'dbot-onboarding__container'}
                setJoyrideStepIndex={0}
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
                className={'dbot-onboarding__container'}
                setJoyrideStepIndex={0}
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
                img={getImageLocation('ic-new-user-step-two.png')}
                className={'dbot-onboarding__container'}
                setJoyrideStepIndex={1}
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
                img={getImageLocation('ic-new-user-step-three.png')}
                className={'dbot-onboarding__container'}
                setJoyrideStepIndex={2}
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
                img={getImageLocation('ic-new-user-step-four.png')}
                className={'dbot-onboarding__container'}
                setJoyrideStepIndex={3}
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
                img={getImageLocation('ic-new-user-step-five.png')}
                className={'dbot-onboarding__container'}
                setJoyrideStepIndex={4}
            />
        ),
        ...joyride_props,
    },
    {
        target: '.animation__wrapper',
        content: (
            <TourGuide
                Label={localize('Run or stop your bot')}
                Content={localize('Click Run when you want to start trading, and click Stop when you want to stop.')}
                img={getImageLocation('ic-new-user-step-seven.png')}
                className={'dbot-onboarding__container'}
                setJoyrideStepIndex={1}
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
                img={getImageLocation('ic-new-user-step-six.png')}
                className={'dbot-onboarding__container'}
                setJoyrideStepIndex={1}
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
                className={'dbot-onboarding__container'}
                setJoyrideStepIndex={0}
            />
        ),
        ...joyride_props,
    },
];
