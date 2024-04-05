import React, { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useCreateWallet } from '@deriv/api-v2';
import { LabelPairedCheckMdFillIcon, LabelPairedPlusMdFillIcon } from '@deriv/quill-icons';
import useDevice from '../../hooks/useDevice';
import useSyncLocalStorageClientAccounts from '../../hooks/useSyncLocalStorageClientAccounts';
import useWalletAccountSwitcher from '../../hooks/useWalletAccountSwitcher';
import { TWalletCarouselItem } from '../../types';
import { WalletButton } from '../Base';
import { useModal } from '../ModalProvider';
import { WalletAddedSuccess } from '../WalletAddedSuccess';
import { WalletCurrencyIcons } from '../WalletCardIcon';
import { WalletError } from '../WalletError';

const WalletsAddMoreCardBanner: React.FC<TWalletCarouselItem> = ({
    currency,
    is_added: isAdded,
    is_crypto: isCrypto,
}) => {
    const switchWalletAccount = useWalletAccountSwitcher();

    const { data, error, isSuccess: isMutateSuccess, mutate, status } = useCreateWallet();
    const { isMobile } = useDevice();
    const history = useHistory();
    const modal = useModal();
    const { addWalletAccountToLocalStorage } = useSyncLocalStorageClientAccounts();

    const renderButtons = useCallback(
        () => (
            <div className='wallets-add-more__success-footer'>
                <WalletButton color='black' onClick={() => modal.hide()} variant='outlined'>
                    Maybe later
                </WalletButton>
                <WalletButton onClick={() => history.push('/wallets/cashier/deposit')}>Deposit now</WalletButton>
            </div>
        ),
        [history] // eslint-disable-line react-hooks/exhaustive-deps
    );

    useEffect(() => {
        if (data && isMutateSuccess) {
            addWalletAccountToLocalStorage(data);
            switchWalletAccount(data?.client_id);
        }
    }, [addWalletAccountToLocalStorage, data, isMutateSuccess, switchWalletAccount]);

    useEffect(
        () => {
            if (status === 'error') {
                modal.show(
                    <WalletError buttonText='Close' errorMessage={error.error.message} onClick={() => modal.hide()} />
                );
            } else if (status === 'success') {
                modal.show(
                    <WalletAddedSuccess
                        currency={data?.currency}
                        displayBalance={data?.display_balance ?? `0.00 ${data?.currency}`}
                        landingCompany={data?.landing_company_shortcode}
                        onPrimaryButtonClick={() => {
                            history.push('/wallets/cashier/deposit');
                            modal.hide();
                        }}
                        onSecondaryButtonClick={() => modal.hide()}
                    />
                );
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            data?.currency,
            data?.display_balance,
            data?.landing_company_shortcode,
            error?.error.message,
            isMobile,
            renderButtons,
            status,
        ]
    );

    return (
        <div className='wallets-add-more__banner'>
            <div className='wallets-add-more__banner-header'>
                <WalletCurrencyIcons currency={currency} size={isCrypto ? 'xl' : 'md'} />
            </div>
            <WalletButton
                color='white'
                disabled={isAdded}
                icon={
                    // TODO: Replace hex colors with values from Deriv UI
                    isAdded ? (
                        <LabelPairedCheckMdFillIcon fill='#333333' />
                    ) : (
                        <LabelPairedPlusMdFillIcon fill='#333333' />
                    )
                }
                onClick={e => {
                    e.stopPropagation();
                    currency && mutate({ account_type: isCrypto ? 'crypto' : 'doughflow', currency });
                }}
                size={isMobile ? 'sm' : 'lg'}
            >
                {isAdded ? 'Added' : 'Add'}
            </WalletButton>
        </div>
    );
};

export default WalletsAddMoreCardBanner;
