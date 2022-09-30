import React from 'react';
import { localize } from '@deriv/translations';
import { Text } from '@deriv/components';

type TJoyrideConfig = Record<'showProgress' | 'showSkipButton' | 'spotlightClicks' | 'disableBeacon', boolean>;

type TStep = {
    label: string | boolean;
    content: string;
};

const Step = ({ label, content }: TStep) => (
    <div className='db-tour'>
        <Text size='s' line_height='s' color='prominent' as='h' weight='bold'>
            {label}
        </Text>
        <Text size='s' line_height='s' color='prominent' as='p'>
            {content}
        </Text>
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
    disableBeacon: true,
};

export const DBOT_ONBOARDING = [
    {
        target: 'body',
        content: (
            <Step
                label={localize('Start with a template')}
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
                label={localize('Start with a template')}
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
        target: '#db-dashboard-cards',
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
