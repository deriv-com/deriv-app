import React from 'react';
import classNames from 'classnames';
import {
    WalletCurrencyCard,
    WalletListCardBadge,
    WalletsAppLinkedWithWalletIcon,
    WalletText,
} from '../../../../../../components';
import useDevice from '../../../../../../hooks/useDevice';
import { useWalletTransfer } from '../../hooks';
import './TransferFormAccountCard.scss';

type TProps = {
    account?: ReturnType<typeof useWalletTransfer>['activeWallet'];
    type?: 'input' | 'modal';
};

const WalletTransferFormAccountCard: React.FC<TProps> = ({ account, type = 'modal' }) => {
    const { isMobile } = useDevice();
    const { activeWallet } = useWalletTransfer();
    const isInput = type === 'input';
    const isModal = type === 'modal';

    return (
        <div
            className={classNames('wallets-transfer-form-account-card', {
                'wallets-transfer-form-account-card--is-input': isInput,
                'wallets-transfer-form-account-card--is-modal': isModal,
            })}
        >
            <div className='wallets-transfer-form-account-card__icon-with-badge'>
                <div
                    className={classNames('wallets-transfer-form-account-card__icon', {
                        'wallets-transfer-form-account-card__icon--is-input': isInput,
                        'wallets-transfer-form-account-card__icon--is-modal': isModal,
                    })}
                >
                    {account?.account_category === 'wallet' ? (
                        <WalletCurrencyCard
                            currency={account?.currencyConfig?.display_code || 'USD'}
                            isDemo={Boolean(account?.isVirtual)}
                            size='sm'
                        />
                    ) : (
                        <WalletsAppLinkedWithWalletIcon
                            appIcon={account?.appIcon || ''}
                            currency={activeWallet?.currency || ''}
                            size='small'
                            walletIcon={activeWallet?.activeWalletIcon || ''}
                        />
                    )}
                </div>
                {isInput && isMobile && (
                    <WalletListCardBadge isDemo={account?.isVirtual} label={account?.landingCompanyName} />
                )}
            </div>

            <div className='wallets-transfer-form-account-card__content'>
                <WalletText as='p' size={isInput ? '2xs' : 'sm'} weight='bold'>
                    {account?.accountName}
                </WalletText>
                <WalletText size={isInput ? '2xs' : 'xs'}>Balance: {account?.displayBalance}</WalletText>
            </div>

            {isModal && (
                <div className='wallets-transfer-form-account-card__modal-badge'>
                    <WalletListCardBadge isDemo={account?.isVirtual} label={account?.landingCompanyName} />
                </div>
            )}
        </div>
    );
};

export default WalletTransferFormAccountCard;
