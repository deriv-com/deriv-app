import { Localize } from '@deriv/translations';
import React from 'react';
import { TooltipRenderProps } from 'react-joyride';

const GuideTooltip = ({
    backProps,
    closeProps,
    continuous,
    index,
    isLastStep,
    primaryProps,
    skipProps,
    step,
    tooltipProps,
}: TooltipRenderProps) => {
    // if (index == 1) {
    //   return <ScrollComponent primaryProps={primaryProps} />;
    // }
    return (
        <div {...tooltipProps}>
            {step.title && <div>{step.title}</div>}
            {step.content && <div>{step.content}</div>}
            <div>
                {continuous && (
                    <button {...primaryProps}>
                        <Localize i18n_default_text='Next' />
                    </button>
                )}
                {!continuous && (
                    <button {...closeProps}>
                        <Localize i18n_default_text='Done' />
                    </button>
                )}
            </div>
        </div>
    );
};

export default GuideTooltip;
