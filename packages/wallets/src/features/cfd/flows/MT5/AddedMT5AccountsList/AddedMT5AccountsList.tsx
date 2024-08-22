import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useAuthorize, useJurisdictionStatus } from '@deriv/api-v2';
import {
    LabelPairedChevronRightCaptionRegularIcon,
    LabelPairedCircleExclamationLgBoldIcon,
    LabelPairedTriangleExclamationMdBoldIcon,
} from '@deriv/quill-icons';
import { InlineMessage, useDevice } from '@deriv-com/ui';
import { WalletText } from '../../../../../components/Base';
import { useModal } from '../../../../../components/ModalProvider';
import { TradingAccountCard } from '../../../../../components/TradingAccountCard';
import { THooks } from '../../../../../types';
import { getMarketTypeDetails, PlatformDetails } from '../../../constants';
import { MT5TradeModal, VerificationFailedModal } from '../../../modals';
import './AddedMT5AccountsList.scss';

type TProps = {
    account: THooks.MT5AccountsList;
};

const AddedMT5AccountsList: React.FC<TProps> = ({ account }) => {
    const { data: activeWallet } = useAuthorize();
    const { getVerificationStatus } = useJurisdictionStatus();
    const jurisdictionStatus = useMemo(
        () => getVerificationStatus(account.landing_company_short || 'svg', account.status),
        [account.landing_company_short, account.status, getVerificationStatus]
    );
    const { title } = getMarketTypeDetails()[account.market_type ?? 'all'];
    const { isMobile } = useDevice();
    const { show } = useModal();

    return (
        <TradingAccountCard
            disabled={jurisdictionStatus.is_pending}
            leading={
                <div className='wallets-added-mt5__icon'>
                    {getMarketTypeDetails()[account.market_type || 'all'].icon}
                </div>
            }
            onClick={() => {
                jurisdictionStatus.is_failed
                    ? show(<VerificationFailedModal selectedJurisdiction={account.landing_company_short} />, {
                          defaultRootId: 'wallets_modal_root',
                      })
                    : show(
                          <MT5TradeModal
                              marketType={account.market_type ?? 'all'}
                              mt5Account={account}
                              platform={PlatformDetails.mt5.platform}
                          />
                      );
            }}
            trailing={
                <div
                    className={classNames('wallets-added-mt5__icon', {
                        'wallets-added-mt5__icon--pending': jurisdictionStatus.is_pending,
                    })}
                >
                    <LabelPairedChevronRightCaptionRegularIcon width={16} />
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
                    <InlineMessage
                        className='wallets-added-mt5__details-badge--warning'
                        icon={
                            <LabelPairedCircleExclamationLgBoldIcon
                                className='wallets-added-mt5__details-badge-icon'
                                fill='var(--du-text-warning)'
                            />
                        }
                    >
                        <WalletText color='warning' size='xs' weight='bold'>
                            Pending verification
                        </WalletText>
                    </InlineMessage>
                )}

                {jurisdictionStatus.is_failed && (
                    <InlineMessage
                        className='wallets-added-mt5__details-badge--error'
                        icon={
                            <LabelPairedTriangleExclamationMdBoldIcon
                                className='wallets-added-mt5__details-badge-icon'
                                fill='var(--du-text-loss-danger)'
                            />
                        }
                    >
                        <WalletText color='error' size='xs' weight='bold'>
                            Verification failed.{' '}
                            <a
                                className='wallets-added-mt5__details-badge--error-link'
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
                )}
            </div>
        </TradingAccountCard>
    );
};

export default AddedMT5AccountsList;
