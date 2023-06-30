import React from 'react';
import { Step, Locale, Styles } from 'react-joyride';
import { Text, SpanButton } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import 'Components/toggle-account-type/toggle-account-type.scss';

export const getWalletStepConfig = (): Step[] => [
    {
        title: (
            <React.Fragment>
                <Text as='p' weight='bold' color='brand-red-coral'>
                    {localize('Wallets')}
                </Text>
                <div className='toggle-account-type__divider' />
            </React.Fragment>
        ),
        content: (
            <Text as='p' size='xs'>
                {localize('This is your Wallet. You can see your total balance for this Wallet here.')}
            </Text>
        ),
        target: '.wallet-header',
        disableBeacon: true,
        disableOverlayClose: true,
        placement: 'bottom-end',
    },
    {
        title: (
            <React.Fragment>
                <Text as='p' weight='bold' color='brand-red-coral'>
                    {localize('Expand Wallets')}
                </Text>
                <div className='toggle-account-type__divider' />
            </React.Fragment>
        ),
        content: (
            <Text as='p' size='xs'>
                <Localize i18n_default_text='Click here to open your Wallet and view the trading accounts linked to this Wallet.' />
            </Text>
        ),

        target: '.wallet-header__balance-arrow-icon',
        disableBeacon: true,
        disableOverlayClose: true,
        placement: 'left',
    },
    {
        title: (
            <React.Fragment>
                <Text as='p' weight='bold' color='brand-red-coral'>
                    {localize('Wallet actions')}
                </Text>
                <div className='toggle-account-type__divider' />
            </React.Fragment>
        ),
        content: (
            <Text as='p' size='xs'>
                {localize(
                    "Perform deposits, withdrawals, and fund transfers using your Wallet. You can also view your Wallet's transaction history."
                )}
            </Text>
        ),
        target: '.wallet-header__description-buttons',
        disableBeacon: true,
        disableOverlayClose: true,
    },
];

export const wallet_tour_styles: Styles = {
    options: {
        width: '28rem',
    },
    tooltip: {
        backgroundColor: 'var(--general-main-1)',
        padding: '1.6rem',
    },
    tooltipTitle: {
        color: 'var(--brand-red-coral)',
        textAlign: 'left',
    },
    tooltipContent: {
        textAlign: 'left',
        fontSize: '1.4rem',
        padding: '1.6rem 0',
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
    },
    buttonNext: {
        padding: '0.9rem',
        fontSize: '1.5rem',
        fontWeight: 'bold',
    },
};

export const getWalletStepLocale = (): Locale => ({
    back: <SpanButton has_effect text={localize('Back')} secondary medium />,
    next: localize('Next'),
    close: localize('Done'),
});
