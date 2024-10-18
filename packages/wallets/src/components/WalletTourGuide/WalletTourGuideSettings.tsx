import React, { PropsWithChildren } from 'react';
import { TooltipRenderProps } from 'react-joyride';
import { LegacyClose2pxIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Button, Text } from '@deriv-com/ui';
import './WalletTourGuide.scss';

export const TooltipComponent = ({
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
    return (
        <div {...tooltipProps} className='wallets-tour-guide__container'>
            <div className='wallets-tour-guide__header'>
                {step?.title as React.ReactNode}
                <LegacyClose2pxIcon
                    className='wallets-tour-guide__close-icon'
                    iconSize='xs'
                    onClick={skipProps.onClick as unknown as React.MouseEventHandler<SVGElement>}
                />
            </div>
            {<div className='wallets-tour-guide__content'>{step.content as React.ReactNode}</div>}
            <div className='wallets-tour-guide__footer'>
                {index > 0 && (
                    <Button {...backProps} borderWidth='sm' color='black' variant='outlined'>
                        <Localize i18n_default_text='Back' />
                    </Button>
                )}
                {continuous && (
                    <Button {...primaryProps}>
                        {isLastStep ? <Localize i18n_default_text='Done' /> : <Localize i18n_default_text='Next' />}
                    </Button>
                )}
                {!continuous && (
                    <Button {...closeProps}>
                        <Localize i18n_default_text='Close' />
                    </Button>
                )}
            </div>
        </div>
    );
};

export const SpotLightHeader = ({ children }: PropsWithChildren) => (
    <Text color='red' size='sm' weight='bold'>
        {children}
    </Text>
);
