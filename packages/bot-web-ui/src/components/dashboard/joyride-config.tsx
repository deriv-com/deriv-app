import React from 'react';
import { localize } from '@deriv/translations';

type TJoyrideProps = Record<'showProgress' | 'showSkipButton' | 'spotlightClicks' | 'disableBeacon', boolean>;
type TTourGuide = {
    Label: string | boolean;
    Content: string;
};

const TourGuide = ({ Label, Content }: TTourGuide) => (
    <div>
        <h1>{Label}</h1>
        <p>{Content}</p>
    </div>
);
const joyride_props: TJoyrideProps = {
    showProgress: true,
    showSkipButton: true,
    spotlightClicks: true,
    disableBeacon: false,
};

export const DBOT_ONBOARDING = [
    {
        target: 'body',
        content: (
            <TourGuide
                Label={localize('Start with a tempplate')}
                Content={localize(
                    'Load a template containing the Martingale, D’Alembert, or Oscar’s Grind strategy, and modify it as you wish.'
                )}
            />
        ),
        ...joyride_props,
    },
    {
        target: '#id-bot-builder',
        content: (
            <TourGuide
                Label={localize('Start with a BotBuilder')}
                Content={localize(
                    'Load a template containing the Martingale, D’Alembert, or Oscar’s Grind strategy, and modify it as you wish.'
                )}
            />
        ),
        ...joyride_props,
    },
    {
        target: '#id-quick-strategy',
        content: (
            <TourGuide
                Label={localize('Start with a tempplate')}
                Content={localize(
                    'Load a template containing the Martingale, D’Alembert, or Oscar’s Grind strategy, and modify it as you wish.'
                )}
            />
        ),
        ...joyride_props,
    },
    {
        target: '#id-charts',
        content: (
            <TourGuide
                Label={localize('Start with a charts')}
                Content={localize(
                    'Load a template containing the Martingale, D’Alembert, or Oscar’s Grind strategy, and modify it as you wish.'
                )}
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
            />
        ),
        ...joyride_props,
    },
    {
        target: '#dc-tabs__content_group_tiles',
        content: (
            <TourGuide
                Label={localize('Start with a tutorials')}
                Content={localize(
                    'Load a template containing the Martingale, D’Alembert, or Oscar’s Grind strategy, and modify it as you wish.'
                )}
            />
        ),
        ...joyride_props,
    },
];
