import React, { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAccountsList, type useAvailableWallets, useCreateWallet } from '@deriv/api';
import { Success } from '../../features/cfd';
import useDevice from '../../hooks/useDevice';
import useSyncLocalStorageClientAccounts from '../../hooks/useSyncLocalStorageClientAccounts';
import CheckIcon from '../../public/images/check.svg';
import PlusIcon from '../../public/images/plus.svg';
import { ModalStepWrapper, ModalWrapper, WalletButton, WalletText } from '../Base';
import { useModal } from '../ModalProvider';
import WalletAddMoreCurrencyIcon from '../WalletAddMoreCurrencyIcon';
import { WalletError } from '../WalletError';

type TWalletsAddMoreCardBannerProps = NonNullable<ReturnType<typeof useAvailableWallets>['data']>[0];

const WalletsAddMoreCardBanner = ({
    currency,
    is_added: isAdded,
    is_crypto: isCrypto,
    landing_company_name: landingCompanyName,
}: TWalletsAddMoreCardBannerProps) => {
    const { switchAccount } = useAccountsList();
    const { data, error, isSuccess: isMutateSuccess, mutate, status } = useCreateWallet();
    const { isMobile } = useDevice();
    const history = useHistory();
    const modal = useModal();
    const syncLocalStorageClientAccounts = useSyncLocalStorageClientAccounts();

    const renderButtons = useCallback(
        () => (
            <div className='wallets-add-more__success-footer'>
                <WalletButton color='black' onClick={() => modal.hide()} text='Maybe later' variant='outlined' />
                <WalletButton onClick={() => history.push('wallets/cashier/deposit')} text='Deposit now' />
            </div>
        ),
        [history, modal]
    );

    useEffect(() => {
        if (data && isMutateSuccess) {
            syncLocalStorageClientAccounts(data);
            switchAccount(data?.client_id);
        }
    }, [data, isMutateSuccess, switchAccount, syncLocalStorageClientAccounts]);

    useEffect(() => {
        if (status === 'error') {
            modal.show(
                <WalletError
                    buttonText='Close'
                    // @ts-expect-error BE returns error.message as string
                    errorMessage={error.error.message}
                    onClick={() => modal.hide()}
                    type='modal'
                />
            );
        } else if (status === 'success') {
            modal.show(
                <React.Fragment>
                    {isMobile && (
                        <ModalStepWrapper renderFooter={renderButtons} title=''>
                            <Success
                                description='Make a deposit into your new Wallet.'
                                displayBalance={`0 ${data?.currency}`}
                                marketType='all'
                                platform='mt5'
                                renderButton={() => null}
                                title={`Your ${
                                    data?.currency
                                } wallet (${data?.landing_company_shortcode?.toUpperCase()}) is ready`}
                            />
                        </ModalStepWrapper>
                    )}
                    {!isMobile && (
                        <ModalWrapper>
                            <Success
                                description='Make a deposit into your new Wallet.'
                                displayBalance={`0 ${data?.currency}`}
                                marketType='all'
                                platform='mt5'
                                renderButton={renderButtons}
                                title={`Your ${
                                    data?.currency
                                } wallet (${data?.landing_company_shortcode?.toUpperCase()}) is ready`}
                            />
                        </ModalWrapper>
                    )}
                </React.Fragment>
            );
        }
    }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className='wallets-add-more__banner'>
            <div className='wallets-add-more__banner-header'>
                <span className='wallets-add-more__banner-logo'>
                    <WalletAddMoreCurrencyIcon currency={currency ? currency.toLowerCase() : ''} />
                </span>
                <div className='wallets-add-more__banner-landing-company'>
                    <WalletText
                        align='right'
                        lineHeight={isMobile ? '3xs' : '2xs'}
                        size={isMobile ? '3xs' : '2xs'}
                        weight='bold'
                    >
                        {landingCompanyName}
                    </WalletText>
                </div>
            </div>
            <button
                className={`wallets-add-more__banner-button ${
                    isAdded ? 'wallets-add-more__banner-button--is-added' : ''
                }`}
                onClick={e => {
                    e.stopPropagation();
                    currency && mutate({ account_type: isCrypto ? 'crypto' : 'doughflow', currency });
                }}
            >
                {isAdded ? (
                    <CheckIcon className='wallets-add-more__banner-button-icon' />
                ) : (
                    <PlusIcon className='wallets-add-more__banner-button-icon' />
                )}
                {isAdded ? 'Added' : 'Add'}
            </button>
        </div>
    );
};

export default WalletsAddMoreCardBanner;
