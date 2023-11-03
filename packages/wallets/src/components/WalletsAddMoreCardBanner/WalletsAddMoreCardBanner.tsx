import React, { useCallback, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useAccountsList, useCreateWallet } from '@deriv/api';
import useDevice from '../../hooks/useDevice';
import useSyncLocalStorageClientAccounts from '../../hooks/useSyncLocalStorageClientAccounts';
import CheckIcon from '../../public/images/check.svg';
import PlusIcon from '../../public/images/plus.svg';
import { THooks } from '../../types';
import { ModalStepWrapper, ModalWrapper, WalletButton, WalletButtonGroup, WalletText } from '../Base';
import { useModal } from '../ModalProvider';
import WalletAddMoreCurrencyIcon from '../WalletAddMoreCurrencyIcon';
import { WalletCard } from '../WalletCard';
import { WalletError } from '../WalletError';
import { WalletSuccess } from '../WalletSuccess';

type TProps = THooks.AvailableWallets;
type TWalletAddedSuccessProps = {
    currency: THooks.CreateWallet['currency'];
    landingCompany: THooks.CreateWallet['landing_company_shortcode'];
    onPrimaryButtonClick: () => void;
    onSecondaryButtonClick: () => void;
};

const WalletAddedSuccess: React.FC<TWalletAddedSuccessProps> = ({
    currency,
    landingCompany,
    onPrimaryButtonClick,
    onSecondaryButtonClick,
}) => {
    const { isMobile } = useDevice();
    const description = 'Make a deposit into your new Wallet.';
    const title = useMemo(
        () => `Your ${currency} wallet (${landingCompany?.toUpperCase()}) is ready`,
        [currency, landingCompany]
    );
    const renderFooter = useCallback(
        () => (
            <WalletButtonGroup isFlex>
                <WalletButton color='black' onClick={onSecondaryButtonClick} text='Maybe later' variant='outlined' />
                <WalletButton onClick={onPrimaryButtonClick} text='Deposit' />
            </WalletButtonGroup>
        ),
        [onPrimaryButtonClick, onSecondaryButtonClick]
    );
    const renderIcon = useCallback(
        () => (
            <WalletCard
                balance={`0.00 ${currency}`}
                currency={currency || 'USD'}
                isDemo={false}
                landingCompanyName={landingCompany}
                width='24rem'
            />
        ),
        [currency, landingCompany]
    );

    if (isMobile)
        return (
            <ModalStepWrapper renderFooter={renderFooter} title=''>
                <WalletSuccess description={description} renderIcon={renderIcon} title={title} />
            </ModalStepWrapper>
        );

    return (
        <ModalWrapper hideCloseButton>
            <WalletSuccess
                description={description}
                renderButton={renderFooter}
                renderIcon={renderIcon}
                title={title}
            />
        </ModalWrapper>
    );
};

const WalletsAddMoreCardBanner: React.FC<TProps> = ({
    currency,
    is_added: isAdded,
    is_crypto: isCrypto,
    landing_company_name: landingCompanyName,
}: TProps) => {
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
        [history] // eslint-disable-line react-hooks/exhaustive-deps
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
                    errorMessage={error.error.message}
                    onClick={() => modal.hide()}
                    type='modal'
                />
            );
        } else if (status === 'success') {
            modal.show(
                <WalletAddedSuccess
                    currency={data?.currency}
                    landingCompany={data?.landing_company_shortcode}
                    onPrimaryButtonClick={() => {
                        history.push('wallets/cashier/deposit');
                        modal.hide();
                    }}
                    onSecondaryButtonClick={() => modal.hide()}
                />
            );
        }
    }, [data?.currency, data?.landing_company_shortcode, error?.error.message, isMobile, renderButtons, status]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className='wallets-add-more__banner'>
            <div className='wallets-add-more__banner-header'>
                <span className='wallets-add-more__banner-logo'>
                    <WalletAddMoreCurrencyIcon currency={currency ? currency.toLowerCase() : ''} />
                </span>
                <div className='wallets-add-more__banner-landing-company'>
                    <WalletText align='right' size='xs' weight='bold'>
                        {landingCompanyName}
                    </WalletText>
                </div>
            </div>
            <WalletButton
                color='white'
                disabled={isAdded}
                icon={
                    isAdded ? (
                        <CheckIcon className='wallets-add-more__banner-button-icon' />
                    ) : (
                        <PlusIcon className='wallets-add-more__banner-button-icon' />
                    )
                }
                onClick={e => {
                    e.stopPropagation();
                    currency && mutate({ account_type: isCrypto ? 'crypto' : 'doughflow', currency });
                }}
                size={isMobile ? 'sm' : 'lg'}
                text={isAdded ? 'Added' : 'Add'}
            />
        </div>
    );
};

export default WalletsAddMoreCardBanner;
