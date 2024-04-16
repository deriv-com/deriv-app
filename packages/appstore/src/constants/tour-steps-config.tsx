import React from 'react';
import { Step, Locale } from 'react-joyride';
import { Text, SpanButton, Icon } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared';
import 'Components/toggle-account-type/toggle-account-type.scss';

const stepProps = {
    disableBeacon: true,
    disableOverlayClose: true,
};

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
        ...stepProps,
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
        ...stepProps,
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
        ...stepProps,
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
        ...stepProps,
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
        ...stepProps,
    },
];

export const getHighRiskTourStepLocale = (): Locale => ({
    back: <SpanButton has_effect text={localize('Repeat tour')} secondary medium />,
    last: <Localize i18n_default_text='OK' />,
    next: <Localize i18n_default_text='Next' />,
});

export const getTourStepLocale = (): Locale => ({
    back: <SpanButton has_effect text={localize('Back')} secondary medium />,
    last: <Localize i18n_default_text='OK' />,
    next: <Localize i18n_default_text='Next' />,
});
