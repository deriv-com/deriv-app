import React from 'react';
import Joyride from 'react-joyride';
import { Localize } from '@deriv/translations';
import GuideTooltip from './guide-tooltip';

type TGuideContainerProps = {
    should_run: boolean;
};

const GuideContainer = ({ should_run }: TGuideContainerProps) => {
    const locale = {
        next: <Localize i18n_default_text='Next' />,
    };
    const steps = [
        {
            target: '.trade__trade-types',
            title: <Localize i18n_default_text='Explore trade types (1/6)' />,
            content: <Localize i18n_default_text='Scroll left or right to explore trade types.' />,
            disableBeacon: true,
        },
        {
            target: '.market-selector__container',
            title: <Localize i18n_default_text='Choose a market (2/6)' />,
            content: <Localize i18n_default_text='View available markets here.' />,
            disableBeacon: true,
        },
    ];

    return (
        <Joyride
            continuous
            disableCloseOnEsc
            disableOverlayClose
            disableScrolling
            showSkipButton
            tooltipComponent={GuideTooltip}
            locale={locale}
            steps={steps}
            run={should_run}
        />
    );
};

export default React.memo(GuideContainer);
