import React, { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount, useCreateOtherCFDAccount, useCtraderAccountsList } from '@deriv/api';
import { TradingAccountCard, WalletError } from '../../../../../components';
import {
    ModalStepWrapper,
    ModalWrapper,
    WalletButton,
    WalletButtonGroup,
    WalletText,
} from '../../../../../components/Base';
import { useModal } from '../../../../../components/ModalProvider';
import { getStaticUrl } from '../../../../../helpers/urls';
import useDevice from '../../../../../hooks/useDevice';
import CTrader from '../../../../../public/images/ctrader.svg';
import { PlatformDetails } from '../../../constants';
import { CFDSuccess } from '../../../screens';
import './AvailableCTraderAccountsList.scss';

const AvailableCTraderAccountsList: React.FC = () => {
    const { hide, show } = useModal();
    const { error, mutate, status } = useCreateOtherCFDAccount();
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: cTraderAccounts } = useCtraderAccountsList();
    const { isMobile } = useDevice();
    const history = useHistory();

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

    const renderButtons = useCallback(
        () => (
            <WalletButtonGroup isFlex isFullWidth>
                <WalletButton onClick={() => hide()} size='lg' variant='outlined'>
                    Maybe later
                </WalletButton>
                <WalletButton
                    onClick={() => {
                        hide();
                        history.push('/wallets/cashier/transfer');
                    }}
                    size='lg'
                >
                    Transfer funds
                </WalletButton>
            </WalletButtonGroup>
        ),
        [hide, history]
    );

    const description =
        accountType === 'demo'
            ? `Transfer virtual funds from your Demo Wallet to your ${PlatformDetails.ctrader.title} Demo account to practice trading.`
            : `Transfer funds from your ${activeWallet?.wallet_currency_type} Wallet to your ${PlatformDetails.ctrader.title} account to start trading.`;

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

    const successComponent = useCallback(() => {
        if (isMobile) {
            return (
                <ModalStepWrapper renderFooter={renderButtons} title={' '}>
                    <CFDSuccess
                        description={description}
                        displayBalance={cTraderAccounts?.find(account => account.login)?.formatted_balance}
                        marketType='all'
                        platform={PlatformDetails.ctrader.platform}
                        renderButton={renderButtons}
                        title={`Your ${PlatformDetails.ctrader.title} ${
                            accountType === 'demo' ? accountType : ''
                        } account is ready`}
                    />
                    ;
                </ModalStepWrapper>
            );
        }
        return (
            <ModalWrapper>
                <CFDSuccess
                    description={description}
                    displayBalance={cTraderAccounts?.find(account => account.login)?.formatted_balance}
                    marketType='all'
                    platform={PlatformDetails.ctrader.platform}
                    renderButton={renderButtons}
                    title={`Your ${PlatformDetails.ctrader.title} ${
                        accountType === 'demo' ? accountType : ''
                    } account is ready`}
                />
            </ModalWrapper>
        );
    }, [accountType, cTraderAccounts, description, isMobile, renderButtons]);

    useEffect(() => {
        if (status === 'success') {
            show(successComponent());
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
    }, [error?.error?.message, hide, show, status, successComponent]);

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
