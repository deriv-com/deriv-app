import { Step, Styles, Locale } from 'react-joyride';
import React from 'react';
import { Text, Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import 'Components/toggle-account-type/toggle-account-type.scss';

export const tour_step_config: Step[] = [
    {
        title: (
            <Text as='p' weight='bold' color='brand-red-coral'>
                {localize('Switch accounts')}
                <div className='toggle-account-type__divider' />
            </Text>
        ),
        content: <Text as='p'>{localize('Switch between your demo and real accounts.')}</Text>,
        target: '.toggle-account-type__button',
        disableBeacon: true,
        placement: 'bottom-end',
    },
    {
        title: (
            <Text as='p' weight='bold' color='brand-red-coral'>
                {localize('Trading hub tour')}
                <div className='toggle-account-type__divider' />
            </Text>
        ),
        content: (
            <Text as='p'>
                {localize(
                    `Need help moving around?\n\nWe have a short turorial that might help. Hit Repeat tour to begin.`
                )}
            </Text>
        ),

        target: '.trading-hub-header__tradinghub--onboarding--logo',
        disableBeacon: true,
    },
];

export const eu_tour_step_config: Step[] = [
    {
        title: (
            <Text as='p' weight='bold' color='brand-red-coral'>
                {localize('Switch accounts')}
                <div className='toggle-account-type__divider' />
            </Text>
        ),
        content: <Text as='p'>{localize('Switch between your demo and real accounts.')}</Text>,
        target: '.toggle-account-type__button',
        disableBeacon: true,
        placement: 'bottom-end',
    },
    {
        title: (
            <Text as='p' weight='bold' color='brand-red-coral'>
                {localize('Trading hub tour')}
                <div className='toggle-account-type__divider' />
            </Text>
        ),
        content: (
            <Text as='p'>{localize(`Need help moving around?\n\nWe have a short turorial that might help.`)}</Text>
        ),

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
};

export const tour_styles_dark_mode: Styles = {
    options: {
        width: 350,
        backgroundColor: 'var(--brand-dark-grey)',
        arrowColor: 'var(--brand-dark-grey)',
    },
    tooltipTitle: {
        color: 'var(--brand-red-coral)',
        textAlign: 'left',
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
};

export const tour_step_locale: Locale = {
    back: <Button has_effect text={localize('Repeat tour')} secondary medium />,
    close: localize('Close'),
    last: localize('OK'),
    next: localize('Next'),
    skip: localize('Skip'),
};

export const eu_tour_step_locale: Locale = {
    close: localize('Close'),
    last: localize('OK'),
    next: localize('Next'),
    skip: localize('Skip'),
};
