import React from 'react';
import { Button, CaptionText, IconButton, Text } from '@deriv-com/quill-ui';
import { LabelPairedChevronsUpXlBoldIcon, LabelPairedXmarkSmBoldIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv/translations';
import { TooltipRenderProps } from 'react-joyride';
import { useSwipeable } from 'react-swipeable';

export interface GuideTooltipProps extends TooltipRenderProps {
    setStepIndex: React.Dispatch<React.SetStateAction<number>>;
}

const GuideTooltip = ({ isLastStep, primaryProps, skipProps, step, tooltipProps, setStepIndex }: GuideTooltipProps) => {
    const swipe_handlers = useSwipeable({
        onSwipedUp: () => {
            document.querySelector('.trade__chart')?.scrollIntoView();
            setStepIndex((prev: number) => prev + 1);
        },
        preventDefaultTouchmoveEvent: true,
        trackTouch: true,
        trackMouse: true,
    });

    if (step.title === 'scroll-icon') {
        return (
            <div {...swipe_handlers} className='guide-tooltip__wrapper-scroll'>
                <LabelPairedChevronsUpXlBoldIcon className='guide-tooltip--bounce' />
                <Text size='sm' bold className='guide-tooltip__wrapper-scroll-text'>
                    <Localize i18n_default_text='Swipe up to see the chart' />
                </Text>
            </div>
        );
    }

    return (
        <div {...tooltipProps} className='guide-tooltip__wrapper'>
            <div>
                {step.title && (
                    <div className='guide-tooltip__header'>
                        <CaptionText bold className='guide-tooltip__header__title'>
                            {step.title}
                        </CaptionText>
                        <IconButton
                            {...skipProps}
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
                {step.content && <CaptionText className='guide-tooltip__content'>{step.content}</CaptionText>}
            </div>
            <Button
                {...primaryProps}
                onClick={e => {
                    setStepIndex((prev: number) => prev + 1);
                    primaryProps.onClick(e);
                }}
                color='white-black'
                className='guide-tooltip__button'
                variant='secondary'
                size='sm'
                label={isLastStep ? <Localize i18n_default_text='Done' /> : <Localize i18n_default_text='Next' />}
            />
        </div>
    );
};

export default GuideTooltip;
