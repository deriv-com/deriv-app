import React from 'react';
import { CaptionText, IconButton } from '@deriv-com/quill-ui';
import { LabelPairedXmarkSmBoldIcon } from '@deriv/quill-icons';
import { TooltipRenderProps } from 'react-joyride';

const GuideTooltip = ({ closeProps, step, tooltipProps }: TooltipRenderProps) => {
    return (
        <div {...tooltipProps} className='guide-tooltip__wrapper'>
            <div>
                {step.title && (
                    <div className='guide-tooltip__header' data-testid='guide-tooltip__header'>
                        <CaptionText bold className='guide-tooltip__header__title'>
                            {step.title}
                        </CaptionText>
                        <IconButton
                            onClick={closeProps.onClick}
                            icon={
                                <LabelPairedXmarkSmBoldIcon
                                    fill='var(--component-textIcon-inverse-prominent)'
                                    key='close-button'
                                />
                            }
                            className='guide-tooltip__close'
                            size='sm'
                            color='white-black'
                            variant='tertiary'
                        />
                    </div>
                )}
                {step.content && (
                    <CaptionText className='guide-tooltip__content' data-testid='guide-tooltip__content'>
                        {step.content}
                    </CaptionText>
                )}
            </div>
        </div>
    );
};

export default GuideTooltip;
