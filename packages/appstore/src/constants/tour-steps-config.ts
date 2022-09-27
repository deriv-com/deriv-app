import { Step, Styles, Locale } from 'react-joyride';

export const tour_step_config: Step[] = [
    {
        title: 'Switch accounts',
        content: 'You can switch between real and demo accounts.',
        target: '.toggle-account-type__button',
        disableBeacon: true,
        placement: 'bottom-end',
    },
    {
        title: 'Trading Hub tour',
        content: `Need help moving around?\n\nWe have a short turorial that might help. Hit Repeat tour to begin.`,
        target: '.trading-hub-header__tradinghub--onboarding--logo',
        disableBeacon: true,
    },
];

export const tour_styles: Styles = {
    options: {
        width: 350,
    },
    tooltipTitle: {
        color: 'var(--brand-red-coral)',
        textAlign: 'left',
        fontWeight: 'bold',
        fontSize: '1.5rem',
    },
    tooltipContent: {
        textAlign: 'left',
        fontSize: '1.6rem',
        padding: '3rem 0 1.6rem 0',
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
    },
    buttonNext: {
        padding: '0.9rem',
        fontSize: '1.5rem',
        fontWeight: 'bold',
    },
    buttonBack: {
        padding: '0.9rem',
        border: '1px solid var( --text-less-prominent)',
        fontSize: '1.5rem',
        color: 'var( --text-general)',
        borderRadius: '0.4rem',
        fontWeight: 'bold',
    },
};

export const tour_step_locale: Locale = {
    back: 'Repeat tour',
    close: 'Close',
    last: 'OK',
    next: 'Next',
    skip: 'Skip',
};
