import React from 'react';
import { Step, TooltipRenderProps } from '@deriv/react-joyride';
import CloseIcon from '../../public/images/close-icon.svg';
import { WalletButton } from '../Base';
import { getDesktopSteps } from './DesktopSteps';
import { getMobileSteps } from './MobileSteps';
import './WalletTourGuide.scss';

export const walletsOnboardingLocalStorageKey = 'walletsOnboarding';
export const walletsOnboardingStartValue = 'started';

export const tourStepConfig = (
    isMobile: boolean,
    isDemoWallet: boolean,
    hasMT5Account: boolean,
    hasDerivAppsTradingAccount: boolean,
    isAllWalletsAlreadyAdded: boolean
): Step[] =>
    isMobile
        ? getMobileSteps(isDemoWallet, hasMT5Account, hasDerivAppsTradingAccount, isAllWalletsAlreadyAdded)
        : getDesktopSteps(isDemoWallet, hasMT5Account, hasDerivAppsTradingAccount, isAllWalletsAlreadyAdded);

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
            <div className='wallets-tour-guide__header'>
                {step?.title as React.ReactNode}
                <CloseIcon
                    className='wallets-tour-guide__close-icon'
                    onClick={closeProps.onClick as unknown as React.MouseEventHandler<SVGElement>}
                />
            </div>
            {<div className='wallets-tour-guide__content'>{step.content as React.ReactNode}</div>}
            <div className='wallets-tour-guide__footer'>
                {index > 0 && <WalletButton {...backProps} color='white' text='Back' variant='outlined' />}
                {continuous && <WalletButton {...primaryProps} text={isLastStep ? 'Done' : 'Next'} />}
                {!continuous && <WalletButton {...closeProps} text='Close' />}
            </div>
        </div>
    );
};
