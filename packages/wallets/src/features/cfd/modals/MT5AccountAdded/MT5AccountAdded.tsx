import React, { FC, useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount, useJurisdictionStatus, useMT5AccountsList, usePOA, usePOI } from '@deriv/api-v2';
import { ModalStepWrapper, ModalWrapper, WalletButton, WalletButtonGroup } from '../../../../components';
import { useModal } from '../../../../components/ModalProvider';
import useDevice from '../../../../hooks/useDevice';
import { THooks, TMarketTypes, TPlatforms } from '../../../../types';
import { companyNamesAndUrls, MarketTypeDetails, PlatformDetails } from '../../constants';
import { CFDSuccess } from '../../screens/CFDSuccess';

type TProps = {
    account?: THooks.CreateMT5Account;
    marketType: TMarketTypes.SortedMT5Accounts;
    platform: TPlatforms.All;
};

const MT5AccountAdded: FC<TProps> = ({ account, marketType, platform }) => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { isMobile } = useDevice();
    const history = useHistory();
    const { getVerificationStatus, isSuccess } = useJurisdictionStatus();
    const { data: mt5Accounts } = useMT5AccountsList();
    const { getModalState, hide } = useModal();
    const { data: poiData } = usePOI();
    const { data: poaData } = usePOA();
    const addedAccount = mt5Accounts?.find(acc => acc.login === account?.login);
    const verificationStatus = getVerificationStatus(addedAccount?.landing_company_short, addedAccount?.status);
    const poiService = poiData?.is_pending ? poiData?.previous?.service : poiData?.current?.service;
    const marketTypeTitle =
        marketType === 'all' && Object.keys(PlatformDetails).includes(platform)
            ? PlatformDetails[platform].title
            : MarketTypeDetails[marketType].title;
    const isPOIVerified = poiData?.status === 'verified';
    const isPOAVerified = poaData?.status === 'verified';
    const selectedJurisdiction = getModalState('selectedJurisdiction');
    const landingCompanyName = `(${
        companyNamesAndUrls?.[selectedJurisdiction as keyof typeof companyNamesAndUrls]?.shortcode
    })`;

    const isDemo = activeWallet?.is_virtual;

    const renderAccountSuccessButton = useCallback(
        (isTransferAllowed = false) => {
            if (isTransferAllowed) {
                return (
                    <WalletButtonGroup isFlex isFullWidth>
                        <WalletButton onClick={hide} size='lg' variant='outlined'>
                            Maybe later
                        </WalletButton>
                        <WalletButton
                            onClick={() => {
                                hide();
                                history.push(`/wallets/cashier/transfer`, { toAccountLoginId: addedAccount?.loginid });
                            }}
                            size='lg'
                        >
                            Transfer funds
                        </WalletButton>
                    </WalletButtonGroup>
                );
            }
            return (
                <div className='wallets-success-btn'>
                    <WalletButton isFullWidth onClick={hide} size='lg'>
                        OK
                    </WalletButton>
                </div>
            );
        },
        [hide, history, addedAccount?.loginid]
    );

    const renderMainContent = useMemo(() => {
        const renderSuccessDescription = () => {
            if (isDemo) {
                return `Let's practise trading with ${activeWallet?.display_balance} virtual funds.`;
            }
            return `Transfer funds from your ${activeWallet?.wallet_currency_type} Wallet to your ${marketTypeTitle} ${landingCompanyName} account to start trading.`;
        };

        if (!isSuccess) return null;

        if (!verificationStatus.is_not_applicable && !isPOIVerified && !isPOAVerified) {
            if (poiService === 'idv') {
                return (
                    <CFDSuccess
                        description={`We need a few minutes to review your documents before you can start trading with your ${marketTypeTitle} ${
                            isDemo ? ' demo' : landingCompanyName
                        } account. You’ll get an in-app notification as soon as this is done.`}
                        displayBalance={
                            mt5Accounts?.find(account => account.market_type === marketType)?.display_balance ?? '0.00'
                        }
                        landingCompany={selectedJurisdiction}
                        marketType={marketType}
                        platform={platform}
                        renderButton={renderAccountSuccessButton}
                        title='Almost there'
                    />
                );
            }

            if (poiService === 'onfido') {
                return (
                    <CFDSuccess
                        description={`We need 1-3 days to review your documents before you can start trading with your ${marketTypeTitle} ${
                            isDemo ? ' demo' : landingCompanyName
                        } account. You’ll get an email as soon as this is done.`}
                        displayBalance={
                            mt5Accounts?.find(account => account.market_type === marketType)?.display_balance ?? '0.00'
                        }
                        landingCompany={selectedJurisdiction}
                        marketType={marketType}
                        platform={platform}
                        renderButton={renderAccountSuccessButton}
                        title='Almost there'
                    />
                );
            }
        }

        return (
            <CFDSuccess
                description={renderSuccessDescription()}
                displayBalance={
                    mt5Accounts?.find(account => account.market_type === marketType)?.display_balance ?? '0.00'
                }
                landingCompany={selectedJurisdiction}
                marketType={marketType}
                platform={platform}
                renderButton={() => renderAccountSuccessButton(!isDemo)}
                title={`Your ${marketTypeTitle} ${isDemo ? 'demo' : landingCompanyName} account is ready`}
            />
        );
    }, [
        activeWallet?.display_balance,
        activeWallet?.wallet_currency_type,
        isDemo,
        isPOAVerified,
        isPOIVerified,
        isSuccess,
        landingCompanyName,
        marketType,
        marketTypeTitle,
        mt5Accounts,
        platform,
        poiService,
        renderAccountSuccessButton,
        selectedJurisdiction,
        verificationStatus.is_not_applicable,
    ]);

    if (isMobile) {
        return <ModalStepWrapper renderFooter={renderAccountSuccessButton}>{renderMainContent}</ModalStepWrapper>;
    }

    return <ModalWrapper hideCloseButton>{renderMainContent}</ModalWrapper>;
};

export default MT5AccountAdded;
