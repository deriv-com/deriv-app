import React, { useCallback } from 'react';
import { useActiveWalletAccount, useIsEuRegion, useMT5AccountsList, useTradingPlatformStatus } from '@deriv/api-v2';
import {
    LabelPairedChevronLeftCaptionRegularIcon,
    LabelPairedChevronRightCaptionRegularIcon,
} from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import { ClientVerificationModal, TradingAccountCard } from '../../../../../components';
import { useModal } from '../../../../../components/ModalProvider';
import useIsRtl from '../../../../../hooks/useIsRtl';
import { TAvailableMT5Account } from '../../../../../types';
import { getClientVerification } from '../../../../../utils';
import {
    getMarketTypeDetails,
    MARKET_TYPE,
    MT5_ACCOUNT_STATUS,
    PRODUCT,
    TRADING_PLATFORM_STATUS,
} from '../../../constants';
import { MT5PasswordModal, TradingPlatformStatusModal } from '../../../modals';
import './AvailableMT5AccountsList.scss';

type TProps = {
    account: TAvailableMT5Account;
};

const AvailableMT5AccountsList: React.FC<TProps> = ({ account }) => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { getPlatformStatus } = useTradingPlatformStatus();
    const { localize } = useTranslations();
    const isRtl = useIsRtl();
    const { setModalState, show } = useModal();
    const { data: isEuRegion } = useIsEuRegion();
    const { availability, description, icon, title } = getMarketTypeDetails(localize, account.product, isEuRegion)[
        account.market_type || MARKET_TYPE.ALL
    ];
    const { data: mt5Accounts } = useMT5AccountsList();
    const platformStatus = getPlatformStatus(account.platform);
    const hasUnavailableAccount = mt5Accounts?.some(account => account.status === 'unavailable');
    const isVirtual = activeWallet?.is_virtual;
    const { hasClientKycStatus } = getClientVerification(account);
    //@ts-expect-error - needs backend type update for account product
    const isNewBadgeVisible = [PRODUCT.ZEROSPREAD, PRODUCT.GOLD].includes(account.product);

    const onButtonClick = useCallback(() => {
        if (hasUnavailableAccount) return show(<TradingPlatformStatusModal status={MT5_ACCOUNT_STATUS.UNAVAILABLE} />);

        switch (platformStatus) {
            case TRADING_PLATFORM_STATUS.MAINTENANCE:
                return show(<TradingPlatformStatusModal status={TRADING_PLATFORM_STATUS.MAINTENANCE} />);
            case TRADING_PLATFORM_STATUS.UNAVAILABLE:
                return show(<TradingPlatformStatusModal status={TRADING_PLATFORM_STATUS.UNAVAILABLE} />);
            case TRADING_PLATFORM_STATUS.ACTIVE:
            default:
                if (!isVirtual && hasClientKycStatus) {
                    show(<ClientVerificationModal account={account} />);
                } else {
                    show(<MT5PasswordModal account={account} isVirtual={isVirtual} />);
                }
                setModalState('marketType', account.market_type);
                setModalState('selectedJurisdiction', account.shortcode);
                break;
        }
    }, [hasUnavailableAccount, show, platformStatus, isVirtual, hasClientKycStatus, setModalState, account]);

    if (isEuRegion && availability === 'Non-EU') return null;

    return (
        <TradingAccountCard onClick={onButtonClick}>
            <TradingAccountCard.Icon className='wallets-available-mt5__icon'>{icon}</TradingAccountCard.Icon>
            <TradingAccountCard.Section>
                <TradingAccountCard.Content className='wallets-available-mt5__details'>
                    <div className='wallets-available-mt5__title'>
                        <Text align='start' size='sm'>
                            {title}
                        </Text>
                        {isNewBadgeVisible && (
                            <div className='wallets-available-mt5__badge'>
                                <Text align='start' size='xs' weight='bold'>
                                    <Localize i18n_default_text='NEW' />
                                </Text>
                            </div>
                        )}
                    </div>
                    <Text align='start' size='xs'>
                        {description}
                    </Text>
                </TradingAccountCard.Content>
                <TradingAccountCard.Button className='wallets-available-mt5__icon'>
                    {isRtl ? (
                        <LabelPairedChevronLeftCaptionRegularIcon width={16} />
                    ) : (
                        <LabelPairedChevronRightCaptionRegularIcon width={16} />
                    )}
                </TradingAccountCard.Button>
            </TradingAccountCard.Section>
        </TradingAccountCard>
    );
};

export default AvailableMT5AccountsList;
