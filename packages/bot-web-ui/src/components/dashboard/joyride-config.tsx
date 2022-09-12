import React from 'react';
import { localize } from '@deriv/translations';

type TJoyrideConfig = Record<'showProgress' | 'showSkipButton' | 'spotlightClicks' | 'disableBeacon', boolean>;

type TStep = {
    label: string | boolean;
    content: string;
};

const Step = ({ label, content }: TStep) => (
    <div>
        <h1>{label}</h1>
        <p>{content}</p>
    </div>
);

/**
 * Joyride specifc config
 * It should be in camel casing.
 */
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
                label={localize('Start with a tempplate')}
                content={localize(
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
                label={localize('Start with a BotBuilder')}
                content={localize(
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
                label={localize('Start with a tempplate')}
                content={localize(
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
                label={localize('Start with a charts')}
                content={localize(
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
                label={localize('Start with a tutorials')}
                content={localize(
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
                label={localize('Start with a tutorials')}
                content={localize(
                    'Load a template containing the Martingale, D’Alembert, or Oscar’s Grind strategy, and modify it as you wish.'
                )}
            />
        ),
        ...joyride_config,
    },
];
