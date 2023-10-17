import React from 'react';
import { Step, TooltipRenderProps } from 'react-joyride';
import { WalletButton, WalletText } from '../Base';
import './WalletTourGuide.scss';

export const tourStepConfig = (
    isDemoWallet: boolean,
    hasMT5: boolean,
    hasDerivAppsTradingAccount: boolean,
    isAllWalletsAlreadyAdded: boolean
): Step[] => [
    {
        content: (
            <WalletText size='sm'>
                This is your Wallet. These are the functions that you can perform within this Wallet and you can
                conveniently view your total balance here.
            </WalletText>
        ),
        disableBeacon: true,
        disableOverlayClose: true,
        target: '.wallets-accordion__header:has(+ .wallets-accordion__content--visible)',
        title: (
            <WalletText color='red' size='sm' weight='bold'>
                Wallets
            </WalletText>
        ),
        placement: 'bottom',
        spotlightPadding: 0,
        styles: { spotlight: { borderRadius: '1.6rem 1.6rem 0rem 0rem' } },
    },
    {
        content: (
            <WalletText size='sm'>
                Perform deposits, withdrawals, and fund transfers using your Wallet. You can also view your Wallet's
                transaction history.
            </WalletText>
        ),
        disableBeacon: true,
        disableOverlayClose: true,
        target: '.wallets-header__actions > button',
        title: (
            <WalletText color='red' size='sm' weight='bold'>
                Wallet actions
            </WalletText>
        ),
        spotlightPadding: 0,
        // styles: {
        //     spotlight: {
        //         width: 504,
        //         height: 32,
        //         borderRadius: '4.8rem',
        //     },
        // },
    },
    {
        content: <WalletText size='sm'>Step 3</WalletText>,
        disableBeacon: true,
        disableOverlayClose: true,
        target: '.wallets-accordion__header:has(+ .wallets-accordion__content--visible)',
        title: (
            <WalletText color='red' size='sm' weight='bold'>
                Wallets
            </WalletText>
        ),
    },
    {
        content: <WalletText size='sm'>Step 4</WalletText>,
        disableBeacon: true,
        disableOverlayClose: true,
        target: '.wallets-accordion__header:has(+ .wallets-accordion__content--visible)',
        title: (
            <WalletText color='red' size='sm' weight='bold'>
                Wallets
            </WalletText>
        ),
    },
];

export const TooltipComponent = ({
    backProps,
    closeProps,
    continuous,
    index,
    isLastStep,
    primaryProps,
    step,
    tooltipProps,
}: TooltipRenderProps) => {
    return (
        <div {...tooltipProps} className='wallets-tour-guide__container'>
            <div className='wallets-tour-guide__header'>{step?.title as React.ReactNode}</div>
            {<div className='wallets-tour-guide__content'>{step.content as React.ReactNode}</div>}
            <div className='wallets-tour-guide__footer'>
                {index > 0 && (
                    <WalletButton {...backProps} color='white' variant='outlined'>
                        <WalletText align='center' color='black' size='sm' weight='bold'>
                            Back
                        </WalletText>
                    </WalletButton>
                )}
                {continuous && (
                    <WalletButton {...primaryProps}>
                        <WalletText align='center' color='white' size='sm' weight='bold'>
                            {`${isLastStep ? 'Close' : 'Next'}`}
                        </WalletText>
                    </WalletButton>
                )}
                {!continuous && (
                    <WalletButton {...closeProps}>
                        <WalletText align='center' color='white' size='sm' weight='bold'>
                            Close
                        </WalletText>
                    </WalletButton>
                )}
            </div>
        </div>
    );
};
