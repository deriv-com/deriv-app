import React from 'react';
import Cookies from 'js-cookie';
import {
    useActiveWalletAccount,
    useCtraderAccountsList,
    useDxtradeAccountsList,
    useIsEuRegion,
    useLandingCompany,
    useMT5AccountsList,
    useSortedMT5Accounts,
    useTradingPlatformStatus,
} from '@deriv/api-v2';
import { localize } from '@deriv-com/translations';
import ProductLinkedBanner from '../../../../components/Banner/ProductLinkedBanner';
import { useModal } from '../../../../components/ModalProvider';
import { TradingAppCardLoader } from '../../../../components/SkeletonLoader';
import { TAddedMT5Account, TAvailableMT5Account } from '../../../../types';
import { MT5_ACCOUNT_STATUS, TRADING_PLATFORM_STATUS } from '../../constants';
import {
    AddedCTraderAccountsList,
    AddedDxtradeAccountsList,
    AddedMT5AccountsList,
    AvailableCTraderAccountsList,
    AvailableDxtradeAccountsList,
    AvailableMT5AccountsList,
} from '../../flows';
import AvailableNakalaTradeAccount from '../../flows/OtherCFDs/DerivNakala/AvailableDerivNakala/AvailableDerivNakala';
import { MT5PasswordModal, TradingPlatformStatusModal } from '../../modals';
import { CFDDerivNakalaLinkAccount } from '../../modals/DerivNakalaModal/DerivAccountNakala';
import './CFDPlatformsListAccounts.scss';

const CFDPlatformsListAccounts: React.FC = () => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { getPlatformStatus } = useTradingPlatformStatus();
    const {
        data: mt5AccountsList,
        isFetchedAfterMount: isMT5FetchedAfterMount,
        isLoading: isMT5Loading,
    } = useSortedMT5Accounts();
    const {
        data: ctraderAccountsList,
        isFetchedAfterMount: isCtraderFetchedAfterMount,
        isLoading: isCTraderLoading,
    } = useCtraderAccountsList();
    const {
        data: dxtradeAccountsList,
        isFetchedAfterMount: isDxtradeFetchedAfterMount,
        isLoading: isDxtradeLoading,
    } = useDxtradeAccountsList();
    const { data: landingCompany, isLoading: isLandingCompanyLoading } = useLandingCompany();
    const { data: isEuRegion } = useIsEuRegion();
    const { hide, setModalState, show } = useModal();

    const { data: mt5Accounts } = useMT5AccountsList();
    const hasUnavailableAccount = mt5Accounts?.some(account => account.status === 'unavailable');
    const isVirtual = activeWallet?.is_virtual;

    const isDemo = activeWallet?.is_virtual;

    const isLoading = isMT5Loading || isCTraderLoading || isDxtradeLoading || isLandingCompanyLoading;
    const isFetchedAfterMount = isMT5FetchedAfterMount || isCtraderFetchedAfterMount || isDxtradeFetchedAfterMount;

    const hasCTraderAccount = !!ctraderAccountsList?.length;
    const hasDxtradeAccount = !!dxtradeAccountsList?.length;

    const hasMT5StandardAccount = mt5AccountsList && mt5AccountsList.find(account => account.product === 'standard');

    const financialRestrictedCountry =
        landingCompany?.financial_company?.shortcode === 'svg' && !landingCompany?.gaming_company;
    const cfdRestrictedCountry =
        landingCompany?.gaming_company?.shortcode === 'svg' && !landingCompany.financial_company;
    const isRestricted = financialRestrictedCountry || cfdRestrictedCountry;

    const isNakalaLinked = Cookies.get('nakala_linked') === 'true';

    if (isLoading || !isFetchedAfterMount) {
        return (
            <div className='wallets-cfd-list-accounts__content'>
                {Array.from({ length: 3 }).map((_, idx) => (
                    <TradingAppCardLoader key={`wallets-carousel-loader-action-${idx}`} />
                ))}
            </div>
        );
    }

    const onButtonClick = () => {
        if (hasMT5StandardAccount?.is_added) {
            return show(<CFDDerivNakalaLinkAccount onclickAction={hide} />);
        }

        const account = hasMT5StandardAccount as TAvailableMT5Account;

        const platformStatus = getPlatformStatus(account.platform);

        if (hasUnavailableAccount) return show(<TradingPlatformStatusModal status={MT5_ACCOUNT_STATUS.UNAVAILABLE} />);

        switch (platformStatus) {
            case TRADING_PLATFORM_STATUS.MAINTENANCE:
                return show(<TradingPlatformStatusModal status={TRADING_PLATFORM_STATUS.MAINTENANCE} />);
            case TRADING_PLATFORM_STATUS.UNAVAILABLE:
                return show(<TradingPlatformStatusModal status={TRADING_PLATFORM_STATUS.UNAVAILABLE} />);
            case TRADING_PLATFORM_STATUS.ACTIVE:
            default:
                show(<MT5PasswordModal account={account} isNakala={true} isVirtual={isVirtual} />);
                setModalState('marketType', account.market_type);
                setModalState('selectedJurisdiction', account.shortcode);
                break;
        }
    };

    return (
        <React.Fragment>
            {!isDemo && !isNakalaLinked && (
                <ProductLinkedBanner
                    description={localize('Copy trading with Deriv Nakala.')}
                    onClick={onButtonClick}
                />
            )}
            <div className='wallets-cfd-list-accounts__content'>
                {mt5AccountsList?.map((account, index) => {
                    if (account.is_added)
                        return (
                            <AddedMT5AccountsList
                                account={account as TAddedMT5Account}
                                key={`added-mt5-list${(account as TAddedMT5Account).loginid}-${index}`}
                            />
                        );

                    return (
                        <AvailableMT5AccountsList
                            account={account as TAvailableMT5Account}
                            key={`available-mt5-list${account.name}-${index}`}
                        />
                    );
                })}
                {!isRestricted && !isEuRegion && (
                    <>
                        {hasCTraderAccount ? <AddedCTraderAccountsList /> : <AvailableCTraderAccountsList />}
                        {hasDxtradeAccount ? <AddedDxtradeAccountsList /> : <AvailableDxtradeAccountsList />}
                    </>
                )}
                {hasMT5StandardAccount?.is_added && <AvailableNakalaTradeAccount />}
            </div>
        </React.Fragment>
    );
};

export default CFDPlatformsListAccounts;
