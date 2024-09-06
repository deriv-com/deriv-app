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
import { Button, Text } from '@deriv-com/ui';
import useDevice from '../../hooks/useDevice';
import { IconButton } from '../Base';
import './WalletListCardActions.scss';

type TProps = {
    accountsActiveTabIndex?: number;
};

const getWalletHeaderButtons = (localize: ReturnType<typeof useTranslations>['localize'], isDemo?: boolean) => {
    const buttons = [
        {
            className: isDemo ? 'wallets-mobile-actions-content-icon' : 'wallets-mobile-actions-content-icon--primary',
            color: isDemo ? 'black' : 'primary',
            icon: isDemo ? <LabelPairedArrowsRotateMdBoldIcon /> : <LabelPairedPlusMdBoldIcon fill='#FFF' />,
            iconColor: isDemo ? 'white' : 'primary',
            name: isDemo ? 'reset-balance' : 'deposit',
            text: isDemo ? localize('Reset balance') : localize('Deposit'),
            variant: isDemo ? 'outlined' : 'contained',
        },
        {
            className: 'wallets-mobile-actions-content-icon',
            color: 'black',
            icon: <LabelPairedMinusMdBoldIcon />,
            iconColor: 'white',
            name: 'withdrawal',
            text: localize('Withdraw'),
            variant: 'outlined',
        },
        {
            className: 'wallets-mobile-actions-content-icon',
            color: 'black',
            icon: <LabelPairedArrowUpArrowDownMdBoldIcon />,
            iconColor: 'white',
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
    const { isMobile } = useDevice();
    const history = useHistory();
    const { localize } = useTranslations();

    const isActive = activeWallet?.is_active;
    const isDemo = activeWallet?.is_virtual;

    if (isMobile)
        return (
            <div className='wallets-mobile-actions__container'>
                <div className='wallets-mobile-actions'>
                    {getWalletHeaderButtons(localize, isDemo).map(button => (
                        <div className='wallets-mobile-actions-content' key={button.name}>
                            <IconButton
                                aria-label={button.name}
                                className={button.className}
                                color={button.iconColor}
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

    return (
        <div className='wallets-header__actions'>
            {getWalletHeaderButtons(localize, isDemo).map(button => (
                <Button
                    aria-label={button.name}
                    borderWidth='sm'
                    color={button.color}
                    icon={button.icon}
                    key={button.name}
                    onClick={() => {
                        history.push(`/wallet/${button.name}`);
                    }}
                    rounded='lg'
                    variant={button.variant}
                >
                    {isActive ? button.text : ''}
                </Button>
            ))}
        </div>
    );
};

export default WalletListCardActions;
