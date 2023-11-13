import React from 'react';
import { TooltipRenderProps } from '@deriv/react-joyride';
import CloseIcon from '../../public/images/close-icon.svg';
import { WalletButton, WalletText } from '../Base';
import './WalletTourGuide.scss';

export const tourStepConfig = (
    isMobile: boolean,
    isDemoWallet: boolean,
    hasMT5Account: boolean,
    hasDerivAppsTradingAccount: boolean,
    isAllWalletsAlreadyAdded: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any[] =>
    isMobile
        ? getMobileSteps(isDemoWallet, hasMT5Account, hasDerivAppsTradingAccount, isAllWalletsAlreadyAdded)
        : getDesktopSteps(isDemoWallet, hasMT5Account, hasDerivAppsTradingAccount, isAllWalletsAlreadyAdded);

const getMobileSteps = (
    isDemoWallet: boolean,
    hasMT5Account: boolean,
    hasDerivAppsTradingAccount: boolean,
    isAllWalletsAlreadyAdded: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any[] => [
    // Wallet card
    {
        content: (
            <WalletText size='sm'>
                This is your Wallet. These are the functions that you can perform within this Wallet and you can
                conveniently view your total balance here.
            </WalletText>
        ),
        disableBeacon: true,
        disableOverlayClose: true,
        placement: 'bottom',
        spotlightPadding: 0,
        styles: { spotlight: { borderRadius: '0.8rem' } },
        target: '.wallets-carousel-content__container .wallets-card',
        title: (
            <WalletText color='red' size='sm' weight='bold'>
                Wallets
            </WalletText>
        ),
    },
    // Choose Wallets
    {
        content: (
            <WalletText size='sm'>
                Choose your preferred Wallet above and tap the trade type to see which account is linked to that Wallet.
            </WalletText>
        ),
        disableBeacon: true,
        disableOverlayClose: true,
        placement: 'bottom',
        spotlightPadding: 4,
        styles: { spotlight: { borderRadius: '0.6rem' } },
        target: '.wallets-tabs-list',
        title: (
            <WalletText color='red' size='sm' weight='bold'>
                Choose Wallets
            </WalletText>
        ),
    },
    // Actions
    {
        content: isDemoWallet ? (
            <WalletText size='sm'>
                Perform Transfer and Reset balance using your Demo Wallet. You can also view your Demo wallet&apos;s
                transaction history.
            </WalletText>
        ) : (
            <WalletText size='sm'>
                Perform deposits, withdrawals, and fund transfers using your Wallet. You can also view your
                Wallet&apos;s transaction history.
            </WalletText>
        ),
        disableBeacon: true,
        disableOverlayClose: true,
        placement: 'bottom',
        spotlightPadding: 4,
        styles: { spotlight: { borderRadius: '0.8rem' } },
        target: '.wallets-mobile-actions',
        title: (
            <WalletText color='red' size='sm' weight='bold'>
                Wallet actions
            </WalletText>
        ),
    },
    // CFDs
    {
        content: hasMT5Account ? (
            <WalletText size='sm'>
                This is your CFDs trading account. Click Transfer to move funds between your Wallet and trading account.
            </WalletText>
        ) : (
            <WalletText size='sm'>
                This is your CFDs trading account. Click Get to create the trading account you desire for trading.
            </WalletText>
        ),
        disableBeacon: true,
        disableOverlayClose: true,
        placement: 'top',
        spotlightPadding: 5,
        styles: { spotlight: { borderRadius: '0.8rem' } },
        target: '.wallets-mt5-list__content .wallets-trading-account-card',
        title: (
            <WalletText color='red' size='sm' weight='bold'>
                CFDs trading accounts
            </WalletText>
        ),
    },
    // create DTrader account
    {
        content: hasDerivAppsTradingAccount ? (
            <WalletText size='sm'>
                This is your Deriv Apps trading account balance. Click Transfer to move funds between your Wallet and
                Deriv Apps trading account.
            </WalletText>
        ) : (
            <WalletText size='sm'>
                This is your Deriv Apps trading account. Click Get to create the Deriv Apps trading account for trading.
            </WalletText>
        ),
        disableBeacon: true,
        disableOverlayClose: true,
        placement: 'top',
        spotlightPadding: 0,
        styles: { spotlight: { borderRadius: '0.8rem' } },
        target: '.wallets-deriv-apps-section',
        title: (
            <WalletText color='red' size='sm' weight='bold'>
                Deriv Apps trading account
            </WalletText>
        ),
    },
    // Open DTrade
    {
        content: hasDerivAppsTradingAccount ? (
            <WalletText size='sm'>Choose a Deriv app to trade options or multipliers.</WalletText>
        ) : (
            <WalletText size='sm'>
                Once you have get a Deriv Apps trading account, choose a Deriv app to trade options or multipliers.
            </WalletText>
        ),
        disableBeacon: true,
        disableOverlayClose: true,
        placement: 'top',
        spotlightPadding: 5,
        styles: { spotlight: { borderRadius: '0.8rem' } },
        target: '.wallets-options-and-multipliers-listing__content .wallets-trading-account-card',
        title: (
            <WalletText color='red' size='sm' weight='bold'>
                Deriv apps
            </WalletText>
        ),
    },
    // Add more wallets
    {
        content: <WalletText size='sm'>Click Add on each card for more Wallets.</WalletText>,
        disableBeacon: true,
        disableOverlayClose: true,
        placement: 'top',
        styles: { spotlight: { borderRadius: '1.6rem' } },
        target: isAllWalletsAlreadyAdded ? 'null' : '.wallets-add-more__card', // skip this if all wallets already added
        title: (
            <WalletText color='red' size='sm' weight='bold'>
                Explore more Wallets
            </WalletText>
        ),
    },
    // Onboarding logo
    {
        content: <WalletText size='sm'>Click here to repeat this tour.</WalletText>,
        disableBeacon: true,
        disableOverlayClose: true,
        placement: 'bottom',
        spotlightPadding: 12,
        styles: { spotlight: { borderRadius: '0.4rem' } },
        target: '.traders-hub-header__tradershub--onboarding--logo',
        title: (
            <WalletText color='red' size='sm' weight='bold'>
                Trader&apos;s Hub tour
            </WalletText>
        ),
    },
];

const getDesktopSteps = (
    isDemoWallet: boolean,
    hasMT5Account: boolean,
    hasDerivAppsTradingAccount: boolean,
    isAllWalletsAlreadyAdded: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any[] => [
    // Wallet header
    {
        content: (
            <WalletText size='sm'>
                This is your Wallet. These are the functions that you can perform within this Wallet and you can
                conveniently view your total balance here.
            </WalletText>
        ),
        disableBeacon: true,
        disableOverlayClose: true,
        placement: 'bottom',
        spotlightPadding: 0,
        styles: { spotlight: { borderRadius: '1.6rem 1.6rem 0rem 0rem' } },
        target: '.wallets-accordion__header',
        title: (
            <WalletText color='red' size='sm' weight='bold'>
                Wallets
            </WalletText>
        ),
    },
    // Actions
    {
        content: isDemoWallet ? (
            <WalletText size='sm'>
                Perform Transfer and Reset balance using your Demo Wallet. You can also view your Demo wallet&apos;s
                transaction history.
            </WalletText>
        ) : (
            <WalletText size='sm'>
                Perform deposits, withdrawals, and fund transfers using your Wallet. You can also view your
                Wallet&apos;s transaction history.
            </WalletText>
        ),
        disableBeacon: true,
        disableOverlayClose: true,
        placement: 'bottom',
        spotlightPadding: 4,
        styles: {
            spotlight: {
                borderRadius: '6.4rem',
            },
        },
        target: '.wallets-accordion__header .wallets-header__actions',
        title: (
            <WalletText color='red' size='sm' weight='bold'>
                Wallet actions
            </WalletText>
        ),
    },
    // CFDs
    {
        content: hasMT5Account ? (
            <WalletText size='sm'>
                This is your CFDs trading account. Click Transfer to move funds between your Wallet and trading account.
            </WalletText>
        ) : (
            <WalletText size='sm'>
                This is your CFDs trading account. Click Get to create the trading account you desire for trading.
            </WalletText>
        ),
        disableBeacon: true,
        disableOverlayClose: true,
        placement: 'right',
        spotlightPadding: 5,
        styles: { spotlight: { borderRadius: '0.4rem' } },
        target: '.wallets-mt5-list__content .wallets-trading-account-card',
        title: (
            <WalletText color='red' size='sm' weight='bold'>
                CFDs trading accounts
            </WalletText>
        ),
    },
    // create DTrader account
    {
        content: hasDerivAppsTradingAccount ? (
            <WalletText size='sm'>
                This is your Deriv Apps trading account balance. Click Transfer to move funds between your Wallet and
                Deriv Apps trading account.
            </WalletText>
        ) : (
            <WalletText size='sm'>
                This is your Deriv Apps trading account. Click Get to create the Deriv Apps trading account for trading.
            </WalletText>
        ),
        disableBeacon: true,
        disableOverlayClose: true,
        placement: 'left',
        spotlightPadding: 0,
        styles: { spotlight: { borderRadius: '0.8rem' } },
        target: '.wallets-deriv-apps-section',
        title: (
            <WalletText color='red' size='sm' weight='bold'>
                Deriv Apps trading account
            </WalletText>
        ),
    },
    // Open DTrade
    {
        content: hasDerivAppsTradingAccount ? (
            <WalletText size='sm'>Choose a Deriv app to trade options or multipliers.</WalletText>
        ) : (
            <WalletText size='sm'>
                Once you have get a Deriv Apps trading account, choose a Deriv app to trade options or multipliers.
            </WalletText>
        ),
        disableBeacon: true,
        disableOverlayClose: true,
        placement: 'right',
        spotlightPadding: 5,
        styles: { spotlight: { borderRadius: '0.8rem' } },
        target: '.wallets-options-and-multipliers-listing__content .wallets-trading-account-card',
        title: (
            <WalletText color='red' size='sm' weight='bold'>
                Deriv apps
            </WalletText>
        ),
    },
    // Add more wallets
    {
        content: <WalletText size='sm'>Click Add on each card for more Wallets.</WalletText>,
        disableBeacon: true,
        disableOverlayClose: true,
        floaterProps: { disableAnimation: false },
        placement: 'right',
        styles: { spotlight: { borderRadius: '1.6rem' } },
        target: isAllWalletsAlreadyAdded ? 'null' : '.wallets-add-more__card', // skip this if all wallets already added
        title: (
            <WalletText color='red' size='sm' weight='bold'>
                Explore more Wallets
            </WalletText>
        ),
    },
    // Onboarding logo
    {
        content: <WalletText size='sm'>Click here to repeat this tour.</WalletText>,
        disableBeacon: true,
        disableOverlayClose: true,
        placement: 'bottom',
        spotlightPadding: 12,
        styles: { spotlight: { borderRadius: '0.4rem' } },
        target: '.traders-hub-header__tradershub--onboarding--logo',
        title: (
            <WalletText color='red' size='sm' weight='bold'>
                Trader&apos;s Hub tour
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
                {continuous && <WalletButton {...primaryProps} text={`${isLastStep ? 'Done' : 'Next'}`} />}
                {!continuous && <WalletButton {...closeProps} text='Close' />}
            </div>
        </div>
    );
};
