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
import { Button, Text, useDevice } from '@deriv-com/ui';
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
            weight: isDemo ? 'normal' : 'bold',
        },
        {
            className: 'wallets-mobile-actions-content-icon',
            color: 'black',
            icon: <LabelPairedMinusMdBoldIcon />,
            iconColor: 'white',
            name: 'withdrawal',
            text: localize('Withdraw'),
            variant: 'outlined',
            weight: 'normal',
        },
        {
            className: 'wallets-mobile-actions-content-icon',
            color: 'black',
            icon: <LabelPairedArrowUpArrowDownMdBoldIcon />,
            iconColor: 'white',
            name: 'account-transfer',
            text: localize('Transfer'),
            variant: 'outlined',
            weight: 'normal',
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
    const isDemo = activeWallet?.is_virtual;

    if (isDesktop)
        return (
            <div className='wallets-header__actions'>
                {isDemo ? (
                    <React.Fragment>
                        <Button
                            aria-label='reset-balance'
                            borderWidth='sm'
                            color='black'
                            icon={<LabelPairedArrowsRotateMdBoldIcon />}
                            onClick={() => {
                                history.push('/wallet/reset-balance');
                            }}
                            rounded='lg'
                            variant='outlined'
                        >
                            {localize('Reset balance')}
                        </Button>
                        <Button
                            aria-label='account-transfer'
                            borderWidth='sm'
                            color='black'
                            icon={<LabelPairedArrowUpArrowDownMdBoldIcon />}
                            onClick={() => {
                                history.push('/wallet/account-transfer');
                            }}
                            rounded='lg'
                            variant='outlined'
                        >
                            {localize('Transfer')}
                        </Button>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Button
                            aria-label='deposit'
                            borderWidth='sm'
                            color='primary'
                            icon={<LabelPairedPlusMdBoldIcon fill='#FFF' />}
                            onClick={() => {
                                history.push('/wallet/deposit');
                            }}
                            rounded='lg'
                            variant='contained'
                        >
                            {localize('Deposit')}
                        </Button>
                        <Button
                            aria-label='withdrawal'
                            borderWidth='sm'
                            color='black'
                            icon={<LabelPairedMinusMdBoldIcon />}
                            onClick={() => {
                                history.push('/wallet/withdrawal');
                            }}
                            rounded='lg'
                            variant='outlined'
                        >
                            {localize('Withdraw')}
                        </Button>
                        <Button
                            aria-label='account-transfer'
                            borderWidth='sm'
                            color='black'
                            icon={<LabelPairedArrowUpArrowDownMdBoldIcon />}
                            onClick={() => {
                                history.push('/wallet/account-transfer');
                            }}
                            rounded='lg'
                            variant='outlined'
                        >
                            {localize('Transfer')}
                        </Button>
                    </React.Fragment>
                )}
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
};

export default WalletListCardActions;
