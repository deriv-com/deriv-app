import React, { useCallback } from 'react';
import { useActiveWalletAccount, useMT5AccountsList, useTradingPlatformStatus } from '@deriv/api-v2';
import { LabelPairedChevronRightCaptionRegularIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import { TradingAccountCard } from '../../../../../components';
import { useModal } from '../../../../../components/ModalProvider';
import { THooks } from '../../../../../types';
import { getMarketTypeDetails, MARKET_TYPE, PRODUCT, TRADING_PLATFORM_STATUS } from '../../../constants';
import { ClientVerificationModal, MT5PasswordModal, TradingPlatformStatusModal } from '../../../modals';
import './AvailableMT5AccountsList.scss';

type TProps = {
    account: THooks.SortedMT5Accounts;
};

const AvailableMT5AccountsList: React.FC<TProps> = ({ account }) => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { getPlatformStatus } = useTradingPlatformStatus();
    const { setModalState, show } = useModal();
    const { description, title } = getMarketTypeDetails(account.product)[account.market_type || MARKET_TYPE.ALL];
    const { data: mt5Accounts } = useMT5AccountsList();
    const platformStatus = getPlatformStatus(account.platform);
    const hasUnavailableAccount = mt5Accounts?.some(account => account.status === 'unavailable');

    const onButtonClick = useCallback(() => {
        if (hasUnavailableAccount) return show(<TradingPlatformStatusModal isServerMaintenance={false} />);

        switch (platformStatus) {
            case TRADING_PLATFORM_STATUS.MAINTENANCE:
                return show(<TradingPlatformStatusModal isServerMaintenance />);
            case TRADING_PLATFORM_STATUS.UNAVAILABLE:
                return show(<TradingPlatformStatusModal />);
            case TRADING_PLATFORM_STATUS.ACTIVE:
            default:
                if (account.client_kyc_status?.poi_status && account.client_kyc_status?.poi_status !== 'verified') {
                    show(<ClientVerificationModal account={account} />);
                } else {
                    show(
                        <MT5PasswordModal
                            account={account}
                            isVirtual={activeWallet?.is_virtual}
                            marketType={account?.market_type || 'synthetic'}
                            platform={account.platform}
                            product={account.product}
                        />
                    );
                }
                setModalState('marketType', account.market_type);
                setModalState('selectedJurisdiction', account.shortcode);
                break;
        }
    }, [hasUnavailableAccount, show, platformStatus, activeWallet?.is_virtual, account, setModalState]);

    return (
        <TradingAccountCard onClick={onButtonClick}>
            <TradingAccountCard.Icon className='wallets-available-mt5__icon'>
                {getMarketTypeDetails(account.product)[account.market_type || MARKET_TYPE.ALL].icon}
            </TradingAccountCard.Icon>
            <TradingAccountCard.Content className='wallets-available-mt5__details'>
                <div className='wallets-available-mt5__title'>
                    <Text className='' size='sm'>
                        {title}
                    </Text>
                    {account.product === PRODUCT.ZEROSPREAD && (
                        <div className='wallets-available-mt5__badge'>
                            <Text size='xs' weight='bold'>
                                NEW
                            </Text>
                        </div>
                    )}
                </div>
                <Text size='xs'>{description}</Text>
            </TradingAccountCard.Content>
            <TradingAccountCard.Button className='wallets-available-mt5__icon'>
                <LabelPairedChevronRightCaptionRegularIcon width={16} />
            </TradingAccountCard.Button>
        </TradingAccountCard>
    );
};

export default AvailableMT5AccountsList;
