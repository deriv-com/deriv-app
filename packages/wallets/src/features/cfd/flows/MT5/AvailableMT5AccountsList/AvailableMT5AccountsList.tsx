import React, { useCallback } from 'react';
import { useActiveWalletAccount, useTradingPlatformStatus } from '@deriv/api-v2';
import { LabelPairedChevronRightCaptionRegularIcon } from '@deriv/quill-icons';
import { TradingAccountCard, WalletText } from '../../../../../components';
import { useModal } from '../../../../../components/ModalProvider';
import { THooks } from '../../../../../types';
import { MARKET_TYPE, MarketTypeDetails, TRADING_PLATFORM_STATUS } from '../../../constants';
import { AccountUnavailableModal, JurisdictionModal, MT5PasswordModal, ServerMaintenanceModal } from '../../../modals';
import './AvailableMT5AccountsList.scss';

type TProps = {
    account: THooks.SortedMT5Accounts;
};

const AvailableMT5AccountsList: React.FC<TProps> = ({ account }) => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { getPlatformStatus } = useTradingPlatformStatus();
    const { setModalState, show } = useModal();

    const { description, title } = MarketTypeDetails[account.market_type || MARKET_TYPE.ALL];
    const platformStatus = getPlatformStatus(account.platform);

    const onButtonClick = useCallback(() => {
        switch (platformStatus) {
            case TRADING_PLATFORM_STATUS.MAINTENANCE:
                return show(<ServerMaintenanceModal platform={account.platform} />);
            case TRADING_PLATFORM_STATUS.UNAVAILABLE:
                return show(<AccountUnavailableModal />);
            case TRADING_PLATFORM_STATUS.ACTIVE:
            default:
                activeWallet?.is_virtual
                    ? show(
                          <MT5PasswordModal
                              marketType={account?.market_type || MARKET_TYPE.SYNTHETIC}
                              platform={account.platform}
                          />
                      )
                    : show(<JurisdictionModal />);
                setModalState('marketType', account.market_type);
                break;
        }
    }, [platformStatus, show, activeWallet?.is_virtual, account.market_type, account.platform, setModalState]);

    return (
        <TradingAccountCard
            leading={
                <div className='wallets-available-mt5__icon'>
                    {MarketTypeDetails[account.market_type || MARKET_TYPE.ALL].icon}
                </div>
            }
            onClick={onButtonClick}
            trailing={
                <div className='wallets-available-mt5__icon'>
                    <LabelPairedChevronRightCaptionRegularIcon width={16} />
                </div>
            }
        >
            <div className='wallets-available-mt5__details'>
                <WalletText size='sm'>{title}</WalletText>
                <WalletText size='xs'>{description}</WalletText>
            </div>
        </TradingAccountCard>
    );
};

export default AvailableMT5AccountsList;
