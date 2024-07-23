import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useTradingPlatformStatus } from '@deriv/api-v2';
import { LegacyWarningIcon } from '@deriv/quill-icons';
import { Badge } from '@deriv-com/ui';
import {
    WalletCurrencyCard,
    WalletListCardBadge,
    WalletMarketCurrencyIcon,
    WalletText,
} from '../../../../../../components';
import useDevice from '../../../../../../hooks/useDevice';
import { TPlatforms } from '../../../../../../types';
import { TRADING_PLATFORM_STATUS } from '../../../../../cfd/constants';
import type { TAccount } from '../../types';
import './TransferFormAccountCard.scss';

type TProps = {
    account?: TAccount;
    type?: 'input' | 'modal';
};

const TransferFormAccountCard: React.FC<TProps> = ({ account, type = 'modal' }) => {
    const { isMobile } = useDevice();
    const { t } = useTranslation();
    const { getPlatformStatus } = useTradingPlatformStatus();

    const isInput = type === 'input';
    const isModal = type === 'modal';

    const platformStatus = getPlatformStatus(account?.account_type);

    const hasPlatformStatus =
        account?.status === TRADING_PLATFORM_STATUS.UNAVAILABLE || TRADING_PLATFORM_STATUS.MAINTENANCE;

    const getBadgeText = () => {
        if (account?.status === TRADING_PLATFORM_STATUS.UNAVAILABLE) return t('Account unavailable');
        if (platformStatus === TRADING_PLATFORM_STATUS.MAINTENANCE) return t('Server maintenance');
        return '';
    };

    return (
        <div
            className={classNames('wallets-transfer-form-account-card', {
                'wallets-transfer-form-account-card--is-input': isInput,
                'wallets-transfer-form-account-card--is-modal': isModal,
            })}
        >
            <div className='wallets-transfer-form-account-card__icon-with-badge'>
                <div className='wallets-transfer-form-account-card__icon'>
                    {account?.account_category === 'wallet' ? (
                        <WalletCurrencyCard
                            currency={account?.currencyConfig?.display_code || 'USD'}
                            isDemo={Boolean(account?.demo_account)}
                            size='sm'
                        />
                    ) : (
                        <WalletMarketCurrencyIcon
                            currency={account?.currency ?? ''}
                            isDemo={Boolean(account?.demo_account)}
                            marketType={account?.market_type}
                            platform={account?.account_type as TPlatforms.All}
                            size='xs'
                        />
                    )}
                </div>
                {isInput && isMobile && !!account?.demo_account && <WalletListCardBadge />}
            </div>

            <div className='wallets-transfer-form-account-card__content'>
                <WalletText as='p' size={isInput ? '2xs' : 'sm'} weight='bold'>
                    {account?.accountName}
                </WalletText>
                <WalletText size={isInput ? '2xs' : 'xs'}>Balance: {account?.displayBalance}</WalletText>
            </div>

            {hasPlatformStatus && (
                <Badge
                    badgeSize='xs'
                    color='warning'
                    isBold
                    leftIcon={<LegacyWarningIcon iconSize='xs' />}
                    padding='tight'
                    rounded='sm'
                    variant='bordered'
                >
                    {getBadgeText()}
                </Badge>
            )}

            {isModal && !!account?.demo_account && (
                <div className='wallets-transfer-form-account-card__modal-badge'>
                    <WalletListCardBadge />
                </div>
            )}
        </div>
    );
};

export default TransferFormAccountCard;
