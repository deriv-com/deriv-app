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
                {isDemo ? (
                    <React.Fragment>
                        <div className='wallets-mobile-actions-content'>
                            <IconButton
                                aria-label='reset-balance'
                                className='wallets-mobile-actions-content-icon'
                                color='black'
                                icon={<LabelPairedArrowsRotateMdBoldIcon />}
                                onClick={() => {
                                    history.push('/wallet/reset-balance', { accountsActiveTabIndex });
                                }}
                            >
                                <Text size='sm'>{localize('Reset balance')}</Text>
                            </IconButton>
                        </div>
                        <div className='wallets-mobile-actions-content'>
                            <IconButton
                                aria-label='account-transfer'
                                className='wallets-mobile-actions-content-icon'
                                color='black'
                                icon={<LabelPairedArrowUpArrowDownMdBoldIcon />}
                                onClick={() => {
                                    history.push('/wallet/account-transfer', { accountsActiveTabIndex });
                                }}
                            >
                                <Text size='sm'>{localize('Transfer')}</Text>
                            </IconButton>
                        </div>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <div className='wallets-mobile-actions-content'>
                            <IconButton
                                aria-label='deposit'
                                className='wallets-mobile-actions-content-icon--primary'
                                color='primary'
                                icon={<LabelPairedPlusMdBoldIcon fill='#FFF' />}
                                onClick={() => {
                                    history.push('/wallet/deposit', { accountsActiveTabIndex });
                                }}
                            >
                                <Text size='sm' weight='bold'>
                                    {localize('Deposit')}
                                </Text>
                            </IconButton>
                        </div>
                        <div className='wallets-mobile-actions-content'>
                            <IconButton
                                aria-label='withdrawal'
                                className='wallets-mobile-actions-content-icon'
                                color='black'
                                icon={<LabelPairedMinusMdBoldIcon />}
                                onClick={() => {
                                    history.push('/wallet/withdrawal', { accountsActiveTabIndex });
                                }}
                            >
                                <Text size='sm'>{localize('Withdraw')}</Text>
                            </IconButton>
                        </div>
                        <div className='wallets-mobile-actions-content'>
                            <IconButton
                                aria-label='account-transfer'
                                className='wallets-mobile-actions-content-icon'
                                color='black'
                                icon={<LabelPairedArrowUpArrowDownMdBoldIcon />}
                                onClick={() => {
                                    history.push('/wallet/account-transfer', { accountsActiveTabIndex });
                                }}
                            >
                                <Text size='sm'>{localize('Transfer')}</Text>
                            </IconButton>
                        </div>
                    </React.Fragment>
                )}
            </div>
        </div>
    );
};

export default WalletListCardActions;
