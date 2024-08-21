import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useAuthorize, useJurisdictionStatus } from '@deriv/api-v2';
import { LabelPairedChevronRightCaptionRegularIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import { InlineMessage } from '../../../../../components/Base';
import { useModal } from '../../../../../components/ModalProvider';
import { TradingAccountCard } from '../../../../../components/TradingAccountCard';
import useDevice from '../../../../../hooks/useDevice';
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
                    <Text size='sm'>{title}</Text>
                    {!activeWallet?.is_virtual && (
                        <div className='wallets-added-mt5__details-title-landing-company'>
                            <Text color='black' size={isMobile ? 'sm' : 'xs'}>
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
                                Pending verification
                            </Text>
                        </InlineMessage>
                    </div>
                )}

                {jurisdictionStatus.is_failed && (
                    <div className='wallets-added-mt5__details-badge'>
                        <InlineMessage size='xs' type='error' variant='outlined'>
                            <Text color='error' size='2xs' weight='bold'>
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
                            </Text>
                        </InlineMessage>
                    </div>
                )}
            </div>
        </TradingAccountCard>
    );
};

export default AddedMT5AccountsList;
