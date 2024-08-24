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
    ];

    return (
        <Joyride
            continuous
            tooltipComponent={GuideTooltip}
            disableCloseOnEsc
            showSkipButton
            disableOverlayClose
            disableScrolling
            locale={locale}
            steps={steps}
            run={should_run}
        />
    );
};

export default React.memo(GuideContainer);
