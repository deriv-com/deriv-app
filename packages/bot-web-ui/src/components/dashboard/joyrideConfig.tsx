import React from 'react';
import { localize } from '@deriv/translations';

type TCommonJoyrideProprties = Record<'showProgress' | 'showSkipButton' | 'spotlightClicks' | 'disableBeacon', boolean>;
interface TourGuideComponent {
    Header: string | boolean;
    Para: string;
}

const TourGuideComponent = ({ Header, Para }: TourGuideComponent) => {
    return (
        <div>
            <h1>{localize(Header)}</h1>
            <p>{localize(Para)}</p>
        </div>
    );
};
const common_joyride_proprties: TCommonJoyrideProprties = {
    showProgress: true,
    showSkipButton: true,
    spotlightClicks: true,
    disableBeacon: false,
};

//Todo need to make a dynamic config
export default {
    DashBorardSteps: [
        {
            target: 'body',
            content: (
                <TourGuideComponent
                    Header={'Start with a tempplate'}
                    Para={
                        'Load a template containing the Martingale, D’Alembert, or Oscar’s Grind strategy, and modify it as you wish.'
                    }
                />
            ),
            ...common_joyride_proprties,
        },
        {
            target: '#id-bot-builder',
            content: (
                <TourGuideComponent
                    Header={'Start with a BotBuilder'}
                    Para={
                        'Load a template containing the Martingale, D’Alembert, or Oscar’s Grind strategy, and modify it as you wish.'
                    }
                />
            ),
            ...common_joyride_proprties,
        },
        {
            target: '#id-quick-strategy',
            content: (
                <TourGuideComponent
                    Header={'Start with a tempplate'}
                    Para={
                        'Load a template containing the Martingale, D’Alembert, or Oscar’s Grind strategy, and modify it as you wish.'
                    }
                />
            ),
            ...common_joyride_proprties,
        },
        {
            target: '#id-charts',
            content: (
                <TourGuideComponent
                    Header={'Start with a charts'}
                    Para={
                        'Load a template containing the Martingale, D’Alembert, or Oscar’s Grind strategy, and modify it as you wish.'
                    }
                />
            ),
            ...common_joyride_proprties,
        },
        {
            target: '#id-tutorials',
            content: (
                <TourGuideComponent
                    Header={'Start with a tutorials'}
                    Para={
                        'Load a template containing the Martingale, D’Alembert, or Oscar’s Grind strategy, and modify it as you wish.'
                    }
                />
            ),
            ...common_joyride_proprties,
        },
        {
            target: '#dc-tabs__content_group_tiles',
            content: (
                <TourGuideComponent
                    Header={'Start with a tutorials'}
                    Para={
                        'Load a template containing the Martingale, D’Alembert, or Oscar’s Grind strategy, and modify it as you wish.'
                    }
                />
            ),
            ...common_joyride_proprties,
        },
    ],
};
