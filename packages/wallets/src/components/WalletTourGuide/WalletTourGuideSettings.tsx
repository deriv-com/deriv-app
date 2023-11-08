import React from 'react';
import { Step, TooltipRenderProps } from 'react-joyride';
import { WalletButton, WalletText } from '../Base';
import './WalletTourGuide.scss';

export const tourStepConfig: Step[] = [
    {
        content: (
            <WalletText size='sm'>
                This is your Wallet. These are the functions that you can perform within this Wallet and you can
                conveniently view your total balance here.
            </WalletText>
        ),
        disableBeacon: true,
        disableOverlayClose: true,
        target: '.wallets-accordion__header',
        title: (
            <WalletText color='red' size='sm' weight='bold'>
                Wallets
            </WalletText>
        ),
    },
    {
        content: <WalletText size='sm'>Step 2</WalletText>,
        disableBeacon: true,
        disableOverlayClose: true,
        target: '.wallets-accordion__header',
        title: (
            <WalletText color='red' size='sm' weight='bold'>
                Wallets
            </WalletText>
        ),
    },
];

export const TooltipComponent: React.FC<TooltipRenderProps> = ({
    backProps,
    closeProps,
    continuous,
    index,
    isLastStep,
    primaryProps,
    step,
    tooltipProps,
}) => {
    return (
        <div {...tooltipProps} className='wallets-tour-guide__container'>
            <div className='wallets-tour-guide__header'>{step?.title as React.ReactNode}</div>
            {<div className='wallets-tour-guide__content'>{step.content as React.ReactNode}</div>}
            <div className='wallets-tour-guide__footer'>
                {index > 0 && <WalletButton {...backProps} color='white' text='Back' variant='outlined' />}
                {continuous && <WalletButton {...primaryProps} text={isLastStep ? 'Close' : 'Next'} />}
                {!continuous && <WalletButton {...closeProps} text='Close' />}
            </div>
        </div>
    );
};
