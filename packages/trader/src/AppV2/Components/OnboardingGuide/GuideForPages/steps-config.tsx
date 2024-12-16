import React from 'react';
import { Step } from 'react-joyride';
import { Localize } from '@deriv/translations';

const STEPS = [
    {
        content: <Localize i18n_default_text='Scroll left or right to explore trade types.' />,
        offset: 0,
        spotlightPadding: 2,
        target: '.trade__parameter-tooltip-info',
        title: <Localize i18n_default_text='Explore trade types (1/6)' />,
        placement: 'top' as Step['placement'],
        disableBeacon: true,
        zIndex: 999,
        styles: {
            spotlight: {
                height: '100px',
            },
        },
    },
];

export default STEPS;
