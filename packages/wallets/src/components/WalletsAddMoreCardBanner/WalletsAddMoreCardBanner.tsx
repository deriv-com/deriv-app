import React, { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useCreateWallet, useDerivAccountsList } from '@deriv/api';
import useDevice from '../../hooks/useDevice';
import useSyncLocalStorageClientAccounts from '../../hooks/useSyncLocalStorageClientAccounts';
import CheckIcon from '../../public/images/check.svg';
import PlusIcon from '../../public/images/plus.svg';
import { THooks } from '../../types';
import { WalletButton } from '../Base';
import { useModal } from '../ModalProvider';
import { WalletAddedSuccess } from '../WalletAddedSuccess';
import WalletAddMoreCurrencyIcon from '../WalletAddMoreCurrencyIcon';
import { WalletError } from '../WalletError';
import WalletListCardBadge from '../WalletListCardBadge/WalletListCardBadge';

type TProps = THooks.AllWalletAccounts;

const WalletsAddMoreCardBanner: React.FC<TProps> = ({
    currency,
    is_added: isAdded,
    is_crypto: isCrypto,
    landing_company_name: landingCompanyName,
}: TProps) => {
    const { switchAccount } = useDerivAccountsList();
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
                <WalletButton onClick={() => history.push('wallets/cashier/deposit')}>Deposit now</WalletButton>
            </div>
        ),
        [history] // eslint-disable-line react-hooks/exhaustive-deps
    );

    useEffect(() => {
        if (data && isMutateSuccess) {
            addWalletAccountToLocalStorage(data);
            switchAccount(data?.client_id);
        }
    }, [addWalletAccountToLocalStorage, data, isMutateSuccess, switchAccount]);

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
                            history.push('wallets/cashier/deposit');
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
                <span className='wallets-add-more__banner-logo'>
                    <WalletAddMoreCurrencyIcon currency={currency ? currency.toLowerCase() : ''} />
                </span>
                <WalletListCardBadge label={landingCompanyName} />
            </div>
            <WalletButton
                color='white'
                disabled={isAdded}
                icon={
                    isAdded ? (
                        <CheckIcon className='wallets-add-more__banner-button-icon' width={16} />
                    ) : (
                        <PlusIcon className='wallets-add-more__banner-button-icon' width={16} />
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
