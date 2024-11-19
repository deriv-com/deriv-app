import React, { useState } from 'react';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { useActiveLinkedToTradingAccount, useActiveWalletAccount, useIsEuRegion } from '@deriv/api-v2';
import { displayMoney } from '@deriv/api-v2/src/utils';
import { LabelPairedArrowUpArrowDownSmBoldIcon } from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import useAllBalanceSubscription from '../../hooks/useAllBalanceSubscription';
import useWalletsMFAccountStatus from '../../hooks/useWalletsMFAccountStatus';
import { THooks } from '../../types';
import { ClientVerificationStatusBadge } from '../ClientVerificationBadge';
import { ClientVerificationModal } from '../ClientVerificationModal';
import { useModal } from '../ModalProvider';
import { TradingAccountCard } from '../TradingAccountCard';
import { WalletDisabledAccountModal } from '../WalletDisabledAccountModal';
import { WalletListCardBadge } from '../WalletListCardBadge';
import { WalletMarketIcon } from '../WalletMarketIcon';
import { WalletStatusBadge } from '../WalletStatusBadge';

type TDerivAppsTradingAccountButtonContent = {
    activeTradingAccount: THooks.TActiveLinkedToTradingAccount;
    isDemo?: boolean;
    isEuRegion: boolean;
    mfAccountStatusDetails?: ReturnType<typeof useWalletsMFAccountStatus>['data'];
};

const DerivAppsTradingAccountButtonContent: React.FC<TDerivAppsTradingAccountButtonContent> = ({
    activeTradingAccount,
    isDemo,
    isEuRegion,
    mfAccountStatusDetails,
}) => {
    const history = useHistory();
    const { show } = useModal();
    const { is_disabled: isAccountDisabled, loginid } = activeTradingAccount ?? {};
    const {
        client_kyc_status: clientKycStatus,
        is_added: isMFAccountAdded,
        mfAccountStatus,
    } = mfAccountStatusDetails ?? {};

    if (isAccountDisabled) {
        return <WalletStatusBadge badgeSize='md' padding='tight' status='disabled' />;
    }

    if (isEuRegion && !isDemo && mfAccountStatus && isMFAccountAdded && clientKycStatus) {
        return (
            <ClientVerificationStatusBadge
                onClick={() =>
                    show(
                        <ClientVerificationModal
                            account={{
                                client_kyc_status: clientKycStatus,
                                is_added: isMFAccountAdded,
                            }}
                        />
                    )
                }
                variant={mfAccountStatus}
            />
        );
    }

    return (
        <button
            className='wallets-deriv-apps-section__button'
            data-testid='dt_deriv-apps-trading-account-transfer-button'
            onClick={() => {
                history.push('/wallet/account-transfer', {
                    toAccountLoginId: loginid,
                });
            }}
        >
            <LabelPairedArrowUpArrowDownSmBoldIcon />
        </button>
    );
};

const AccountBalance: React.FC<{ activeTradingAccount: THooks.TActiveLinkedToTradingAccount }> = ({
    activeTradingAccount,
}) => {
    const { data: balanceData, isLoading: isBalanceLoading } = useAllBalanceSubscription();
    const balance = balanceData?.[activeTradingAccount?.loginid ?? '']?.balance;

    return isBalanceLoading ? (
        <div
            className='wallets-skeleton wallets-deriv-apps-balance-loader'
            data-testid='dt_deriv-apps-balance-loader'
        />
    ) : (
        <Text align='start' size='sm' weight='bold'>
            {displayMoney(balance, activeTradingAccount?.currency_config?.display_code, {
                fractional_digits: activeTradingAccount?.currency_config?.fractional_digits,
            })}
        </Text>
    );
};

const DerivAppsTradingAccount = () => {
    const [shouldShowDisabledAccountModal, setShouldShowDisabledAccountModal] = useState(false);
    const { localize } = useTranslations();
    const { isDesktop } = useDevice();
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: activeLinkedToTradingAccount } = useActiveLinkedToTradingAccount();
    const { data: isEuRegion, isLoading: isEuRegionLoading } = useIsEuRegion();
    const { data: mfAccountStatusDetails, isLoading: isMFAccountLoading } = useWalletsMFAccountStatus();

    const isLoading = isEuRegionLoading || isMFAccountLoading;

    const shouldHideBalance =
        isLoading ||
        (isEuRegion && mfAccountStatusDetails.mfAccountStatus) ||
        activeLinkedToTradingAccount?.is_disabled;

    return (
        <>
            <TradingAccountCard
                className={classNames('wallets-deriv-apps-section wallets-deriv-apps-section__border', {
                    'wallets-deriv-apps-section--disabled': activeLinkedToTradingAccount?.is_disabled,
                })}
                onClick={() => {
                    if (activeLinkedToTradingAccount?.is_disabled) {
                        setShouldShowDisabledAccountModal(true);
                    }
                }}
            >
                <TradingAccountCard.Icon
                    className={classNames({
                        'wallets-deriv-apps-section--disabled-icon': activeLinkedToTradingAccount?.is_disabled,
                    })}
                >
                    <WalletMarketIcon icon='standard' size={isDesktop ? 'lg' : 'md'} />
                </TradingAccountCard.Icon>
                <TradingAccountCard.Section>
                    <TradingAccountCard.Content
                        className={classNames({
                            'wallets-deriv-apps-section--disabled-content': activeLinkedToTradingAccount?.is_disabled,
                        })}
                    >
                        <div className='wallets-deriv-apps-section__title-and-badge'>
                            <Text align='start' size='sm'>
                                {isEuRegion ? (
                                    <Localize i18n_default_text='Multipliers' />
                                ) : (
                                    <Localize i18n_default_text='Options' />
                                )}
                            </Text>
                            {activeWallet?.is_virtual && <WalletListCardBadge />}
                        </div>
                        {shouldHideBalance ? null : (
                            <AccountBalance activeTradingAccount={activeLinkedToTradingAccount} />
                        )}

                        <Text align='start' color='less-prominent' lineHeight='sm' size='xs' weight='bold'>
                            {activeLinkedToTradingAccount?.loginid}
                        </Text>
                    </TradingAccountCard.Content>
                    <TradingAccountCard.Button>
                        {isLoading ? (
                            <div
                                className='wallets-skeleton wallets-deriv-apps-button-content-loader'
                                data-testid='dt_deriv-apps-button-content-loader'
                            />
                        ) : (
                            <DerivAppsTradingAccountButtonContent
                                activeTradingAccount={activeLinkedToTradingAccount}
                                isDemo={activeWallet?.is_virtual}
                                isEuRegion={isEuRegion}
                                mfAccountStatusDetails={mfAccountStatusDetails}
                            />
                        )}
                    </TradingAccountCard.Button>
                </TradingAccountCard.Section>
            </TradingAccountCard>
            {shouldShowDisabledAccountModal && (
                <WalletDisabledAccountModal
                    accountType={localize('Options')}
                    isVisible={shouldShowDisabledAccountModal}
                    onClose={() => setShouldShowDisabledAccountModal(false)}
                />
            )}
        </>
    );
};

export { DerivAppsTradingAccount };
