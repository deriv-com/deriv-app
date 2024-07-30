import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useAuthorize, useJurisdictionStatus, useTradingPlatformStatus } from '@deriv/api-v2';
import { LabelPairedChevronRightCaptionRegularIcon } from '@deriv/quill-icons';
import { InlineMessage, WalletText } from '../../../../../components/Base';
import { useModal } from '../../../../../components/ModalProvider';
import { TradingAccountCard } from '../../../../../components/TradingAccountCard';
import useDevice from '../../../../../hooks/useDevice';
import { THooks } from '../../../../../types';
import { PlatformStatusBadge } from '../../../components/PlatformStatusBadge';
import {
    JURISDICTION,
    MARKET_TYPE,
    MarketTypeDetails,
    PlatformDetails,
    TRADING_PLATFORM_STATUS,
} from '../../../constants';
import { MT5TradeModal, TradingPlatformStatusModal, VerificationFailedModal } from '../../../modals';
import './AddedMT5AccountsList.scss';

type TProps = {
    account: THooks.MT5AccountsList;
};

const AddedMT5AccountsList: React.FC<TProps> = ({ account }) => {
    const { data: activeWallet } = useAuthorize();
    const { getVerificationStatus } = useJurisdictionStatus();
    const jurisdictionStatus = useMemo(
        () => getVerificationStatus(account.landing_company_short || JURISDICTION.SVG, account.status),
        [account.landing_company_short, account.status, getVerificationStatus]
    );
    const { title } = MarketTypeDetails[account.market_type ?? MARKET_TYPE.ALL];
    const { isMobile } = useDevice();
    const { show } = useModal();

    const { getPlatformStatus } = useTradingPlatformStatus();
    const platformStatus = getPlatformStatus(account.platform);

    const hasPlatformStatus =
        account.status === TRADING_PLATFORM_STATUS.UNAVAILABLE ||
        platformStatus === TRADING_PLATFORM_STATUS.MAINTENANCE;

    const isServerMaintenance = platformStatus === TRADING_PLATFORM_STATUS.MAINTENANCE;

    return (
        <TradingAccountCard
            disabled={jurisdictionStatus.is_pending}
            leading={
                <div className='wallets-added-mt5__icon'>
                    {MarketTypeDetails[account.market_type || MARKET_TYPE.ALL].icon}
                </div>
            }
            onClick={() => {
                if (hasPlatformStatus)
                    return show(<TradingPlatformStatusModal isServerMaintenance={isServerMaintenance} />);
                if (platformStatus === TRADING_PLATFORM_STATUS.ACTIVE) {
                    return jurisdictionStatus.is_failed
                        ? show(<VerificationFailedModal selectedJurisdiction={account.landing_company_short} />, {
                              defaultRootId: 'wallets_modal_root',
                          })
                        : show(
                              <MT5TradeModal
                                  marketType={account.market_type ?? MARKET_TYPE.ALL}
                                  mt5Account={account}
                                  platform={PlatformDetails.mt5.platform}
                              />
                          );
                }
            }}
            trailing={
                <div
                    className={classNames('wallets-added-mt5__icon', {
                        'wallets-added-mt5__icon--pending': jurisdictionStatus.is_pending,
                    })}
                >
                    {hasPlatformStatus ? (
                        <PlatformStatusBadge
                            badgeSize='md'
                            className='wallets-added-mt5__icon--badge'
                            mt5Account={account}
                        />
                    ) : (
                        <div className='wallets-available-mt5__icon'>
                            <LabelPairedChevronRightCaptionRegularIcon width={16} />
                        </div>
                    )}
                </div>
            }
        >
            <div className='wallets-added-mt5__details'>
                <div className='wallets-added-mt5__details-title'>
                    <WalletText size='sm'>{title}</WalletText>
                    {!activeWallet?.is_virtual && (
                        <div className='wallets-added-mt5__details-title-landing-company'>
                            <WalletText color='black' size={isMobile ? 'sm' : 'xs'}>
                                {account.landing_company_short?.toUpperCase()}
                            </WalletText>
                        </div>
                    )}
                </div>
                {!(jurisdictionStatus.is_failed || jurisdictionStatus.is_pending) && (
                    <WalletText size='sm' weight='bold'>
                        {account.display_balance}
                    </WalletText>
                )}

                <WalletText as='p' size='xs'>
                    {account.display_login}
                </WalletText>
                {jurisdictionStatus.is_pending && (
                    <div className='wallets-added-mt5__details-badge'>
                        <InlineMessage size='xs' type='warning' variant='outlined'>
                            <WalletText color='warning' size='2xs' weight='bold'>
                                Pending verification
                            </WalletText>
                        </InlineMessage>
                    </div>
                )}

                {jurisdictionStatus.is_failed && (
                    <div className='wallets-added-mt5__details-badge'>
                        <InlineMessage size='xs' type='error' variant='outlined'>
                            <WalletText color='error' size='2xs' weight='bold'>
                                Verification failed.{' '}
                                <a
                                    onClick={() =>
                                        show(
                                            <VerificationFailedModal
                                                selectedJurisdiction={account.landing_company_short}
                                            />,
                                            {
                                                defaultRootId: 'wallets_modal_root',
                                            }
                                        )
                                    }
                                >
                                    Why?
                                </a>
                            </WalletText>
                        </InlineMessage>
                    </div>
                )}
            </div>
        </TradingAccountCard>
    );
};

export default AddedMT5AccountsList;
