import React from 'react';
import { localize } from '@deriv/translations';

type TJoyrideConfig = Record<'showProgress' | 'showSkipButton' | 'spotlightClicks' | 'disableBeacon', boolean>;

type TStep = {
    Label: string | boolean;
    Content: string;
};

const Step = ({ Label, Content }: TStep) => (
    <div>
        <h1>{Label}</h1>
        <p>{Content}</p>
    </div>
);
const joyride_config: TJoyrideConfig = {
    showProgress: true,
    showSkipButton: true,
    spotlightClicks: true,
    disableBeacon: false,
};

export const DBOT_ONBOARDING = [
    {
        target: 'body',
        content: (
            <Step
                Label={localize('Start with a tempplate')}
                Content={localize(
                    'Load a template containing the Martingale, D’Alembert, or Oscar’s Grind strategy, and modify it as you wish.'
                )}
            />
        ),
        ...joyride_config,
    },
    {
        target: '#id-bot-builder',
        content: (
            <Step
                Label={localize('Start with a BotBuilder')}
                Content={localize(
                    'Load a template containing the Martingale, D’Alembert, or Oscar’s Grind strategy, and modify it as you wish.'
                )}
            />
        ),
        ...joyride_config,
    },
    {
        target: '#id-quick-strategy',
        content: (
            <Step
                Label={localize('Start with a tempplate')}
                Content={localize(
                    'Load a template containing the Martingale, D’Alembert, or Oscar’s Grind strategy, and modify it as you wish.'
                )}
            />
        ),
        ...joyride_config,
    },
    {
        target: '#id-charts',
        content: (
            <Step
                Label={localize('Start with a charts')}
                Content={localize(
                    'Load a template containing the Martingale, D’Alembert, or Oscar’s Grind strategy, and modify it as you wish.'
                )}
            />
        ),
        ...joyride_config,
    },
    {
        target: '#id-tutorials',
        content: (
            <Step
                Label={localize('Start with a tutorials')}
                Content={localize(
                    'Load a template containing the Martingale, D’Alembert, or Oscar’s Grind strategy, and modify it as you wish.'
                )}
            />
        ),
        ...joyride_config,
    },
    {
        target: '#dc-tabs__content_group_tiles',
        content: (
            <Step
                Label={localize('Start with a tutorials')}
                Content={localize(
                    'Load a template containing the Martingale, D’Alembert, or Oscar’s Grind strategy, and modify it as you wish.'
                )}
            />
        ),
        ...joyride_config,
    },
];
