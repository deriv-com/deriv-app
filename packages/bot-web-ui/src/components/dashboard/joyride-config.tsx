import React from 'react';
import { localize } from '@deriv/translations';

type TCommonJoyrideProprties = Record<'showProgress' | 'showSkipButton' | 'spotlightClicks' | 'disableBeacon', boolean>;
interface ITourGuideComponent {
    Label: string | boolean;
    Content: string;
}

const TourGuideComponent = ({ Label, Content }: ITourGuideComponent) => {
    return (
        <div>
            <h1>{Label}</h1>
            <p>{Content}</p>
        </div>
    );
};
const common_joyride_properties: TCommonJoyrideProprties = {
    showProgress: true,
    showSkipButton: true,
    spotlightClicks: true,
    disableBeacon: false,
};

export const DBOT_ONBOARDING = [
    {
        target: 'body',
        content: (
            <TourGuideComponent
                Label={localize('Start with a tempplate')}
                Content={localize(
                    'Load a template containing the Martingale, D’Alembert, or Oscar’s Grind strategy, and modify it as you wish.'
                )}
            />
        ),
        ...common_joyride_properties,
    },
    {
        target: '#id-bot-builder',
        content: (
            <TourGuideComponent
                Label={localize('Start with a BotBuilder')}
                Content={localize(
                    'Load a template containing the Martingale, D’Alembert, or Oscar’s Grind strategy, and modify it as you wish.'
                )}
            />
        ),
        ...common_joyride_properties,
    },
    {
        target: '#id-quick-strategy',
        content: (
            <TourGuideComponent
                Label={localize('Start with a tempplate')}
                Content={localize(
                    'Load a template containing the Martingale, D’Alembert, or Oscar’s Grind strategy, and modify it as you wish.'
                )}
            />
        ),
        ...common_joyride_properties,
    },
    {
        target: '#id-charts',
        content: (
            <TourGuideComponent
                Label={localize('Start with a charts')}
                Content={localize(
                    'Load a template containing the Martingale, D’Alembert, or Oscar’s Grind strategy, and modify it as you wish.'
                )}
            />
        ),
        ...common_joyride_properties,
    },
    {
        target: '#id-tutorials',
        content: (
            <TourGuideComponent
                Label={localize('Start with a tutorials')}
                Content={localize(
                    'Load a template containing the Martingale, D’Alembert, or Oscar’s Grind strategy, and modify it as you wish.'
                )}
            />
        ),
        ...common_joyride_properties,
    },
    {
        target: '#dc-tabs__content_group_tiles',
        content: (
            <TourGuideComponent
                Label={localize('Start with a tutorials')}
                Content={localize(
                    'Load a template containing the Martingale, D’Alembert, or Oscar’s Grind strategy, and modify it as you wish.'
                )}
            />
        ),
        ...common_joyride_properties,
    },
];
