import React, { PropsWithChildren } from 'react';
import { TooltipRenderProps } from 'react-joyride';
import { LegacyClose2pxIcon } from '@deriv/quill-icons';
import { Button } from '@deriv-com/ui';
import { WalletText } from '../Base';
import './WalletTourGuide.scss';

export const walletsOnboardingLocalStorageKey = 'walletsOnboarding';
export const walletsOnboardingStartValue = 'started';

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
                        Back
                    </Button>
                )}
                {continuous && <Button {...primaryProps}>{isLastStep ? 'Done' : 'Next'}</Button>}
                {!continuous && <Button {...closeProps}>Close</Button>}
            </div>
        </div>
    );
};

export const SpotLightHeader = ({ children }: PropsWithChildren) => (
    <WalletText color='red' size='sm' weight='bold'>
        {children}
    </WalletText>
);
