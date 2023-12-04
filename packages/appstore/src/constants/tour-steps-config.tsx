import { Step, Styles, Locale } from 'react-joyride';
import React from 'react';
import { Text, SpanButton, Icon } from '@deriv/components';
import { Localize } from '@deriv/translations';
import 'Components/toggle-account-type/toggle-account-type.scss';
import { isMobile } from '@deriv/shared';

export const tour_step_config: Step[] = [
    {
        title: (
            <React.Fragment>
                <Text as='p' weight='bold' color='brand-red-coral'>
                    <Localize i18n_default_text='Switch accounts' />
                </Text>
                <div className='toggle-account-type__divider' />
            </React.Fragment>
        ),
        content: (
            <Text as='p'>
                <Localize i18n_default_text='You can switch between real and demo accounts.' />
            </Text>
        ),
        target: '.account-type-dropdown--parent',
        disableBeacon: true,
        disableOverlayClose: true,
    },
    {
        title: (
            <React.Fragment>
                <Text as='p' weight='bold' color='brand-red-coral'>
                    <Localize i18n_default_text='Choice of regulation' />
                </Text>
                <div className='toggle-account-type__divider' />
            </React.Fragment>
        ),
        content: (
            <Text as='p'>
                <Localize
                    i18n_default_text='You can create real accounts under EU or non-EU regulation. Click the <0><0/> icon to learn more about these accounts.'
                    components={[
                        <Text key={0}>
                            <Icon icon='IcInfoOutline' />
                        </Text>,
                    ]}
                />
            </Text>
        ),
        target: isMobile() ? '.main-title-bar-mobile--regulator' : '.regulators-switcher__container',
        disableBeacon: true,
        disableOverlayClose: true,
    },
    {
        title: (
            <React.Fragment>
                <Text as='p' weight='bold' color='brand-red-coral'>
                    <Localize i18n_default_text="Trader's Hub tour" />
                </Text>
                <div className='toggle-account-type__divider' />
            </React.Fragment>
        ),
        content: (
            <Text as='p'>
                <Localize i18n_default_text='Click here if you ever need to repeat this tour.' />
            </Text>
        ),
        target: '.traders-hub-header__tradershub--onboarding--logo',
        disableBeacon: true,
        disableOverlayClose: true,
    },
];

export const tour_step_config_high_risk: Step[] = [
    {
        title: (
            <React.Fragment>
                <Text as='p' weight='bold' color='brand-red-coral'>
                    <Localize i18n_default_text='Switch accounts' />
                </Text>
                <div className='toggle-account-type__divider' />
            </React.Fragment>
        ),
        content: (
            <Text as='p'>
                <Localize i18n_default_text='You can switch between real and demo accounts.' />
            </Text>
        ),
        target: '.account-type-dropdown--parent',
        disableBeacon: true,
        disableOverlayClose: true,
    },
    {
        title: (
            <React.Fragment>
                <Text as='p' weight='bold' color='brand-red-coral'>
                    <Localize i18n_default_text="Trader's Hub tour" />
                </Text>
                <div className='toggle-account-type__divider' />
            </React.Fragment>
        ),
        content: (
            <Text as='p'>
                <Localize i18n_default_text='Click here if you ever need to repeat this tour.' />
            </Text>
        ),
        target: '.traders-hub-header__tradershub--onboarding--logo',
        disableBeacon: true,
        disableOverlayClose: true,
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
        backgroundColor: 'var(--general-section-3)',
        arrowColor: 'var(--general-section-3)',
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

export const getTourStepLocale = (): Locale => ({
    back: (
        <SpanButton has_effect secondary medium>
            <Localize i18n_default_text='Back' />
        </SpanButton>
    ),
    close: <Localize i18n_default_text='Close' />,
    last: <Localize i18n_default_text='OK' />,
    next: <Localize i18n_default_text='Next' />,
    skip: <Localize i18n_default_text='Skip' />,
});
