import React, { useEffect } from 'react';
import { useActiveWalletAccount, useCreateOtherCFDAccount } from '@deriv/api';
import { TradingAccountCard, WalletError } from '../../../../../components';
import { WalletButton, WalletText } from '../../../../../components/Base';
import { useModal } from '../../../../../components/ModalProvider';
import { getStaticUrl } from '../../../../../helpers/urls';
import CTrader from '../../../../../public/images/ctrader.svg';
import { PlatformDetails } from '../../../constants';
import { CTraderSuccessModal } from '../../../modals/CTraderSuccessModal';
import './AvailableCTraderAccountsList.scss';

const AvailableCTraderAccountsList: React.FC = () => {
    const { hide, show } = useModal();
    const { error, mutate, status } = useCreateOtherCFDAccount();
    const { data: activeWallet } = useActiveWalletAccount();

    const accountType = activeWallet?.is_virtual ? 'demo' : 'real';

    const onSubmit = () => {
        mutate({
            payload: {
                account_type: accountType,
                market_type: 'all',
                platform: PlatformDetails.ctrader.platform,
            },
        });
    };

    const leadingIcon = () => (
        <div
            className='wallets-available-ctrader__icon'
            onClick={() => {
                window.open(getStaticUrl('/deriv-ctrader'));
            }}
            // Fix sonarcloud issue
            onKeyDown={event => {
                if (event.key === 'Enter') {
                    window.open(getStaticUrl('/deriv-ctrader'));
                }
            }}
        >
            <CTrader />
        </div>
    );

    const trailingButton = () => (
        <WalletButton
            color='primary-light'
            onClick={() => {
                onSubmit();
            }}
        >
            Get
        </WalletButton>
    );

    useEffect(() => {
        if (status === 'success') {
            show(
                <CTraderSuccessModal
                    isDemo={accountType === 'demo'}
                    walletCurrencyType={activeWallet?.wallet_currency_type || 'USD'}
                />
            );
        }
        if (status === 'error') {
            show(
                <WalletError
                    errorMessage={error?.error?.message ?? 'Something went wrong. Please try again'}
                    onClick={() => hide()}
                    title={error?.error?.message ?? 'Error'}
                />
            );
        }
    }, [accountType, activeWallet?.wallet_currency_type, error?.error?.message, hide, show, status]);

    return (
        <div className='wallets-available-ctrader'>
            <TradingAccountCard leading={leadingIcon} trailing={trailingButton}>
                <div className='wallets-available-ctrader__details'>
                    <WalletText size='sm' weight='bold'>
                        {PlatformDetails.ctrader.title}
                    </WalletText>
                    <WalletText size='xs'>This account offers CFDs on a feature-rich trading platform.</WalletText>
                </div>
            </TradingAccountCard>
        </div>
    );
};

export default AvailableCTraderAccountsList;
