import React from 'react';

const TourGuideComponent = data => {
    const { Header, Para } = data;
    return (
        <div>
            <h1>{Header}</h1>
            <p>{Para}</p>
        </div>
    );
};

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
            showProgress: true,
            showSkipButton: true,
            spotlightClicks: true,
            disableBeacon: true,
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
            showProgress: true,
            showSkipButton: true,
            spotlightClicks: true,
            disableBeacon: true,
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
            showProgress: true,
            spotlightClicks: true,
            showSkipButton: false,
            disableBeacon: true,
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
            showProgress: true,
            showSkipButton: false,
            spotlightClicks: true,
            disableBeacon: true,
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
            showProgress: true,
            showSkipButton: false,
            spotlightClicks: true,
            disableBeacon: true,
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
            showProgress: true,
            showSkipButton: false,
            spotlightClicks: true,
            disableBeacon: true,
        },
    ],
};
