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
            target: '#id-quick-strategy',
            text: 'Start using the <strong>joyride</strong>',
            content: (
                <TourGuideComponent
                    Header={'Start with a tempplate'}
                    Para={
                        'Load a template containing the Martingale, D’Alembert, or Oscar’s Grind strategy, and modify it as you wish.'
                    }
                />
            ),
        },
        {
            target: '#id-bot-builder',
            content: 'Start using the <strong>joyride</strong>',
            text: 'Start using the <strong>joyride</strong>',
        },
        {
            target: '#id-charts',
            content: 'Start using the <strong>joyride</strong>',
            text: 'Start using the <strong>joyride</strong>',
        },
        {
            target: '#id-tutorials',
            content: 'Start using the <strong>joyride</strong>',
            text: 'Start using the <strong>joyride</strong>',
        },
    ],
};
