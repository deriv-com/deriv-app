import React, { FC, useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount, useMT5AccountsList, usePOA, usePOI } from '@deriv/api-v2';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Button, useDevice } from '@deriv-com/ui';
import { ModalStepWrapper, ModalWrapper, WalletButtonGroup } from '../../../../components';
import { useModal } from '../../../../components/ModalProvider';
import { THooks, TMarketTypes, TPlatforms } from '../../../../types';
import {
    CFD_PLATFORMS,
    companyNamesAndUrls,
    getMarketTypeDetails,
    MARKET_TYPE,
    PlatformDetails,
} from '../../constants';
import { CFDSuccess } from '../../screens/CFDSuccess';

type TProps = {
    account?: THooks.CreateMT5Account;
    marketType: TMarketTypes.SortedMT5Accounts;
    platform: TPlatforms.All;
    product?: THooks.AvailableMT5Accounts['product'];
};

const MT5AccountAdded: FC<TProps> = ({ account, marketType, platform, product }) => {
    const { data: activeWallet, isLoading: isActiveWalletAccountLoading } = useActiveWalletAccount();
    const { data: mt5Accounts, isLoading: isMT5AccountsListLoading } = useMT5AccountsList();
    const { data: poiData, isLoading: isPOILoading } = usePOI();
    const { data: poaData, isLoading: isPOALoading } = usePOA();

    const history = useHistory();
    const { isDesktop } = useDevice();
    const { localize } = useTranslations();
    const { getModalState, hide } = useModal();

    const addedAccount = mt5Accounts?.find(acc => acc.login === account?.login);

    const isLoading =
        isActiveWalletAccountLoading ||
        isMT5AccountsListLoading ||
        isPOILoading ||
        !poiData ||
        isPOALoading ||
        !poaData ||
        !addedAccount;

    const marketTypeTitle =
        marketType === MARKET_TYPE.ALL && platform in PlatformDetails && platform !== CFD_PLATFORMS.MT5
            ? PlatformDetails[platform].title
            : getMarketTypeDetails(localize, product)[marketType].title;
    const selectedJurisdiction = getModalState('selectedJurisdiction');
    const landingCompanyName = `(${
        companyNamesAndUrls?.[selectedJurisdiction as keyof typeof companyNamesAndUrls]?.shortcode
    })`;

    const isDemo = activeWallet?.is_virtual;
    const buttonSize = isDesktop ? 'md' : 'lg';

    const renderAccountSuccessButton = useCallback(
        (isDemo?: boolean) => {
            if (isDemo) {
                return (
                    <div className='wallets-success-btn'>
                        <Button isFullWidth onClick={hide} size={buttonSize} textSize='sm'>
                            <Localize i18n_default_text='OK' />
                        </Button>
                    </div>
                );
            }
            return (
                <div className='wallets-mt5-password-modal__footer'>
                    <WalletButtonGroup isFlex isFullWidth>
                        <Button
                            borderWidth='sm'
                            color='black'
                            onClick={hide}
                            size={buttonSize}
                            textSize='sm'
                            variant='outlined'
                        >
                            <Localize i18n_default_text='Maybe later' />
                        </Button>
                        <Button
                            onClick={() => {
                                hide();
                                history.push('/wallet/account-transfer', {
                                    toAccountLoginId: addedAccount?.loginid,
                                });
                            }}
                            size={buttonSize}
                            textSize='sm'
                        >
                            <Localize i18n_default_text='Transfer funds' />
                        </Button>
                    </WalletButtonGroup>
                </div>
            );
        },
        [hide, buttonSize, history, addedAccount?.loginid]
    );

    const renderSuccessDescription = useMemo(() => {
        if (isDemo) {
            return localize('Practise trading with {{accountBalance}} virtual funds.', {
                accountBalance: addedAccount?.display_balance,
            });
        }
        return localize(
            'Transfer funds from your {{walletCurrencyType}} Wallet to your {{marketTypeTitle}} {{landingCompanyName}} account to start trading.',
            { landingCompanyName, marketTypeTitle, walletCurrencyType: activeWallet?.wallet_currency_type }
        );
    }, [
        activeWallet?.wallet_currency_type,
        addedAccount?.display_balance,
        isDemo,
        marketTypeTitle,
        landingCompanyName,
        localize,
    ]);

    const renderMainContent = useMemo(() => {
        if (isLoading) return null;

        return (
            <CFDSuccess
                actionButtons={renderAccountSuccessButton(isDemo)}
                description={renderSuccessDescription}
                displayBalance={addedAccount?.display_balance}
                landingCompanyName={landingCompanyName}
                marketType={marketType}
                platform={platform}
                product={product}
                title={
                    <Localize
                        i18n_default_text='Your {{marketTypeTitle}} {{demoTitle}} account is ready'
                        values={{
                            demoTitle: isDemo ? localize('demo') : landingCompanyName,
                            marketTypeTitle:
                                isDemo && platform === CFD_PLATFORMS.MT5
                                    ? `${CFD_PLATFORMS.MT5.toUpperCase()} ${getMarketTypeDetails(localize, product)[marketType].title}`
                                    : marketTypeTitle,
                        }}
                    />
                }
            />
        );
    }, [
        addedAccount?.display_balance,
        isDemo,
        isLoading,
        landingCompanyName,
        localize,
        marketType,
        marketTypeTitle,
        platform,
        renderAccountSuccessButton,
        renderSuccessDescription,
        product,
    ]);

    if (isLoading) return null;

    if (isDesktop) {
        return (
            <ModalWrapper hideCloseButton>
                <div className='wallets-mt5-password-modal wallets-mt5-password-modal__body'>{renderMainContent}</div>
            </ModalWrapper>
        );
    }

    return (
        <ModalStepWrapper renderFooter={() => renderAccountSuccessButton(isDemo)}>
            <div className='wallets-mt5-password-modal wallets-mt5-password-modal__body'>{renderMainContent}</div>
        </ModalStepWrapper>
    );
};

export default MT5AccountAdded;
