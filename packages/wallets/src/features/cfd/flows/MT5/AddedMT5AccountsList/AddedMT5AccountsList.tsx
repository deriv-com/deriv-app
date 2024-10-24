import React, { useState } from 'react';
import classNames from 'classnames';
import {
    LabelPairedChevronLeftCaptionRegularIcon,
    LabelPairedChevronRightCaptionRegularIcon,
} from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import { WalletDisabledAccountModal, WalletStatusBadge } from '../../../../../components';
import { useModal } from '../../../../../components/ModalProvider';
import { TradingAccountCard } from '../../../../../components/TradingAccountCard';
import useIsRtl from '../../../../../hooks/useIsRtl';
import { ClientVerificationStatusBadge, PlatformStatusBadge } from '../../../components';
import { DISABLED_PLATFORM_STATUSES, MARKET_TYPE, PlatformDetails } from '../../../constants';
import { ClientVerificationModal, MT5TradeModal, TradingPlatformStatusModal } from '../../../modals';
import { TAddedMT5Account } from '../../../types';
import { useAddedMT5Account } from './hooks';
import './AddedMT5AccountsList.scss';

type TProps = { account: TAddedMT5Account };

type TDisabledPlatformStatus = typeof DISABLED_PLATFORM_STATUSES[number];

const AddedMT5AccountsList: React.FC<TProps> = ({ account }) => {
    const { localize } = useTranslations();
    const isRtl = useIsRtl();
    const {
        accountDetails,
        hasDisabledPlatformStatus,
        isAccountDisabled,
        kycStatus,
        platformStatus,
        showMT5TradeModal,
    } = useAddedMT5Account(account);

    const { show } = useModal();
    const [showDisabledAccountModal, setShowDisabledAccountModal] = useState(false);

    const shouldShowBalance = !isAccountDisabled && !(kycStatus || hasDisabledPlatformStatus);

    return (
        <>
            <TradingAccountCard
                className={classNames('wallets-added-mt5__card', {
                    'wallets-added-mt5__card--disabled': isAccountDisabled || hasDisabledPlatformStatus,
                })}
                onClick={() => {
                    if (isAccountDisabled) {
                        setShowDisabledAccountModal(true);
                        return;
                    }

                    if (hasDisabledPlatformStatus) {
                        return show(<TradingPlatformStatusModal status={platformStatus as TDisabledPlatformStatus} />, {
                            defaultRootId: 'wallets_modal_root',
                        });
                    }

                    if (showMT5TradeModal) {
                        return show(
                            <MT5TradeModal
                                marketType={account.market_type ?? MARKET_TYPE.ALL}
                                mt5Account={account}
                                platform={PlatformDetails.mt5.platform}
                            />,
                            { defaultRootId: 'wallets_modal_root' }
                        );
                    }
                }}
            >
                <TradingAccountCard.Icon className='wallets-added-mt5__icon'>
                    {accountDetails.icon}
                </TradingAccountCard.Icon>
                <TradingAccountCard.Section>
                    <TradingAccountCard.Content
                        className={classNames('wallets-added-mt5__details', {
                            'wallets-added-mt5__details--disabled': isAccountDisabled || hasDisabledPlatformStatus,
                        })}
                    >
                        <div className='wallets-added-mt5__details-title'>
                            <Text size='sm'>{accountDetails.title}</Text>
                        </div>
                        {shouldShowBalance && (
                            <Text align='start' size='sm' weight='bold'>
                                {account.display_balance}
                            </Text>
                        )}
                        <Text align='start' as='p' size='xs'>
                            {account.display_login}
                        </Text>
                        {!isAccountDisabled && kycStatus && (
                            <ClientVerificationStatusBadge
                                onClick={() =>
                                    show(<ClientVerificationModal account={account} />, {
                                        defaultRootId: 'wallets_modal_root',
                                    })
                                }
                                variant={kycStatus}
                            />
                        )}
                        {!isAccountDisabled && platformStatus && (
                            <PlatformStatusBadge
                                badgeSize='md'
                                className='wallets-added-mt5__icon--badge'
                                status={platformStatus as TDisabledPlatformStatus}
                            />
                        )}
                        {isAccountDisabled && <WalletStatusBadge badgeSize='md' padding='tight' status='disabled' />}
                    </TradingAccountCard.Content>
                    <TradingAccountCard.Button
                        className={classNames('wallets-added-mt5__icon', {
                            'wallets-added-mt5__icon--pending': kycStatus === 'in_review',
                        })}
                    >
                        <div className='wallets-available-mt5__icon'>
                            {isRtl ? (
                                <LabelPairedChevronLeftCaptionRegularIcon width={16} />
                            ) : (
                                <LabelPairedChevronRightCaptionRegularIcon width={16} />
                            )}
                        </div>
                    </TradingAccountCard.Button>
                </TradingAccountCard.Section>
            </TradingAccountCard>
            <WalletDisabledAccountModal
                accountType={localize('CFDs')}
                isVisible={showDisabledAccountModal}
                onClose={() => setShowDisabledAccountModal(false)}
            />
        </>
    );
};

export default AddedMT5AccountsList;
