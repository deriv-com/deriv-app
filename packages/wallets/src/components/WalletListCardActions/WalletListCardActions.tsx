import React from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount } from '@deriv/api-v2';
import {
    LabelPairedArrowsRotateMdBoldIcon,
    LabelPairedArrowUpArrowDownMdBoldIcon,
    LabelPairedMinusMdBoldIcon,
    LabelPairedPlusMdBoldIcon,
} from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import { IconButton, WalletButton } from '../Base';
import './WalletListCardActions.scss';

type TProps = {
    accountsActiveTabIndex?: number;
};

const getWalletHeaderButtons = (localize: ReturnType<typeof useTranslations>['localize'], isDemo?: boolean) => {
    const buttons = [
        {
            className: isDemo ? 'wallets-mobile-actions-content-icon' : 'wallets-mobile-actions-content-icon--primary',
            color: isDemo ? 'white' : 'primary',
            icon: isDemo ? <LabelPairedArrowsRotateMdBoldIcon /> : <LabelPairedPlusMdBoldIcon fill='#FFF' />,
            name: isDemo ? 'reset-balance' : 'deposit',
            text: isDemo ? localize('Reset balance') : localize('Deposit'),
            variant: isDemo ? 'outlined' : 'contained',
        },
        {
            className: 'wallets-mobile-actions-content-icon',
            color: 'white',
            icon: <LabelPairedMinusMdBoldIcon />,
            name: 'withdrawal',
            text: localize('Withdraw'),
            variant: 'outlined',
        },
        {
            className: 'wallets-mobile-actions-content-icon',
            color: 'white',
            icon: <LabelPairedArrowUpArrowDownMdBoldIcon />,
            name: 'account-transfer',
            text: localize('Transfer'),
            variant: 'outlined',
        },
    ] as const;

    // Filter out the "Withdraw" button when is_demo is true
    const filteredButtons = isDemo ? buttons.filter(button => button.name !== 'withdrawal') : buttons;

    return filteredButtons;
};

const WalletListCardActions: React.FC<TProps> = ({ accountsActiveTabIndex }) => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { isDesktop } = useDevice();
    const history = useHistory();
    const { localize } = useTranslations();

    const isActive = activeWallet?.is_active;
    const isDemo = activeWallet?.is_virtual;

    if (isDesktop)
        return (
            <div className='wallets-header__actions'>
                {getWalletHeaderButtons(localize, isDemo).map(button => (
                    <WalletButton
                        ariaLabel={button.name}
                        icon={button.icon}
                        key={button.name}
                        onClick={() => {
                            history.push(`/wallet/${button.name}`);
                        }}
                        rounded='lg'
                        variant={button.variant}
                    >
                        {isActive ? button.text : ''}
                    </WalletButton>
                ))}
            </div>
        );

    return (
        <div className='wallets-mobile-actions__container'>
            <div className='wallets-mobile-actions'>
                {getWalletHeaderButtons(localize, isDemo).map(button => (
                    <div className='wallets-mobile-actions-content' key={button.name}>
                        <IconButton
                            aria-label={button.name}
                            className={button.className}
                            color={button.color}
                            icon={button.icon}
                            onClick={() => {
                                history.push(`/wallet/${button.name}`, { accountsActiveTabIndex });
                            }}
                            size='lg'
                        />
                        <Text size='sm' weight={button.text === localize('Deposit') ? 'bold' : 'normal'}>
                            {button.text}
                        </Text>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WalletListCardActions;
