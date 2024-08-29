import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useAuthorize, useJurisdictionStatus, useTradingPlatformStatus } from '@deriv/api-v2';
import { LabelPairedChevronRightCaptionRegularIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import { InlineMessage } from '../../../../../components/Base';
import { useModal } from '../../../../../components/ModalProvider';
import { TradingAccountCard } from '../../../../../components/TradingAccountCard';
import { THooks } from '../../../../../types';
import { PlatformStatusBadge } from '../../../components/PlatformStatusBadge';
import {
    getMarketTypeDetails,
    JURISDICTION,
    MARKET_TYPE,
    MT5_ACCOUNT_STATUS,
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
    const { title } = getMarketTypeDetails()[account.market_type ?? MARKET_TYPE.ALL];
    const { isMobile } = useDevice();
    const { show } = useModal();

    const { getPlatformStatus } = useTradingPlatformStatus();
    const platformStatus = getPlatformStatus(account.platform);

    const hasPlatformStatus =
        account.status === TRADING_PLATFORM_STATUS.UNAVAILABLE ||
        account.status === MT5_ACCOUNT_STATUS.UNDER_MAINTENANCE ||
        platformStatus === TRADING_PLATFORM_STATUS.MAINTENANCE;

    const isServerMaintenance =
        platformStatus === TRADING_PLATFORM_STATUS.MAINTENANCE ||
        account.status === MT5_ACCOUNT_STATUS.UNDER_MAINTENANCE;
    const showPlatformStatus = hasPlatformStatus && !(jurisdictionStatus.is_pending || jurisdictionStatus.is_failed);
    return (
        <TradingAccountCard
            disabled={jurisdictionStatus.is_pending}
            onClick={() => {
                if (hasPlatformStatus)
                    return show(<TradingPlatformStatusModal isServerMaintenance={isServerMaintenance} />, {
                        defaultRootId: 'wallets_modal_root',
                    });
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
        >
            <TradingAccountCard.Icon className='wallets-added-mt5__icon'>
                {getMarketTypeDetails()[account.market_type || MARKET_TYPE.ALL].icon}
            </TradingAccountCard.Icon>
            <TradingAccountCard.Content className='wallets-added-mt5__details'>
                <div className='wallets-added-mt5__details-title'>
                    <Text size='sm'>{title}</Text>
                    {!activeWallet?.is_virtual && (
                        <div className='wallets-added-mt5__details-title-landing-company'>
                            <Text color='prominent' size={isMobile ? 'sm' : 'xs'}>
                                {account.landing_company_short?.toUpperCase()}
                            </Text>
                        </div>
                    )}
                </div>
                {!(jurisdictionStatus.is_failed || jurisdictionStatus.is_pending) && (
                    <Text size='sm' weight='bold'>
                        {account.display_balance}
                    </Text>
                )}

                <Text as='p' size='xs'>
                    {account.display_login}
                </Text>
                {jurisdictionStatus.is_pending && (
                    <div className='wallets-added-mt5__details-badge'>
                        <InlineMessage size='xs' type='warning' variant='outlined'>
                            <Text color='warning' size='2xs' weight='bold'>
                                <Localize i18n_default_text='Pending verification' />
                            </Text>
                        </InlineMessage>
                    </div>
                )}

                {jurisdictionStatus.is_failed && (
                    <div className='wallets-added-mt5__details-badge'>
                        <InlineMessage size='xs' type='error' variant='outlined'>
                            <Text color='error' size='2xs' weight='bold'>
                                <Localize
                                    components={[
                                        <a
                                            className='wallets-added-mt5__badge--error-link'
                                            key={0}
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
                                        />,
                                    ]}
                                    i18n_default_text='Verification failed <0>Why?</0>'
                                />
                            </Text>
                        </InlineMessage>
                    </div>
                )}
            </TradingAccountCard.Content>
            <TradingAccountCard.Button
                className={classNames('wallets-added-mt5__icon', {
                    'wallets-added-mt5__icon--pending': jurisdictionStatus.is_pending,
                })}
            >
                {showPlatformStatus ? (
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
            </TradingAccountCard.Button>
        </TradingAccountCard>
    );
};

export default AddedMT5AccountsList;
