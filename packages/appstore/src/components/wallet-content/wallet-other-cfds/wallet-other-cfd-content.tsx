import React from 'react';
import { useStore, observer } from '@deriv/stores';
import { useActiveWallet, useExistingCFDAccounts } from '@deriv/hooks';
import TradingAppCard from 'Components/containers/trading-app-card';
import { formatMoney } from '@deriv/shared';
import { TDetailsOfEachMT5Loginid, TWalletAccount } from 'Types';
import { localize } from '@deriv/translations';

type TWalletOtherCFDContent = {
    wallet_account: TWalletAccount;
};

const WalletOtherCFDContent = observer(({ wallet_account }: TWalletOtherCFDContent) => {
    const {
        modules: { cfd },
        traders_hub,
        ui,
        common,
    } = useStore();
    const {
        selected_region,
        getExistingAccounts,
        selected_account_type,
        no_CR_account,
        is_real,
        getAccount,
        has_any_real_account,
        toggleAccountTransferModal,
        setSelectedAccount,
        showTopUpModal,
        startTrade,
    } = traders_hub;
    const { setAccountType } = cfd;
    const { setAppstorePlatform } = common;
    const { openDerivRealAccountNeededModal } = ui;

    const { data: dxtrade } = useExistingCFDAccounts();
    const wallet = useActiveWallet();

    return (
        <React.Fragment>
            {/**
             * todo: Please extract this out to a separate component after derivez is available and make this component as parent for Other CFDs
             */}
            {dxtrade.dxtrade_accounts?.map(account => {
                const existing_accounts = getExistingAccounts(account.platform || '', account.market_type || '');
                return existing_accounts.map((existing_account: TDetailsOfEachMT5Loginid) => {
                    return (
                        <TradingAppCard
                            action_type='multi-action'
                            availability={selected_region}
                            clickable_icon
                            icon='DerivX'
                            name={`${formatMoney(existing_account.currency, existing_account.display_balance, true)} ${
                                existing_account.currency
                            }`}
                            description={existing_account.login}
                            platform={account.platform}
                            key={`trading_app_card_${existing_account.login}`}
                            is_wallet={true}
                            is_wallet_demo={!!wallet?.is_demo}
                            onAction={(e?: React.MouseEvent<HTMLButtonElement>) => {
                                const button_name = e?.currentTarget?.name;
                                if (button_name === 'transfer-btn') {
                                    toggleAccountTransferModal();
                                    setSelectedAccount(existing_account);
                                } else if (button_name === 'topup-btn') {
                                    showTopUpModal(existing_account);
                                    setAppstorePlatform(account.platform);
                                } else {
                                    startTrade(account.platform, existing_account);
                                }
                            }}
                        />
                    );
                });
            })}
            {!dxtrade.dxtrade_accounts?.length && (
                <TradingAppCard
                    action_type='get'
                    icon='DerivX'
                    availability={selected_region}
                    clickable_icon
                    name={localize('Deriv X')}
                    platform='dxtrade'
                    description={localize('Trade CFDs on Deriv X with financial markets and our Derived indices')}
                    is_wallet={true}
                    is_wallet_demo={!!wallet_account.is_virtual}
                    onAction={() => {
                        if ((!has_any_real_account || no_CR_account) && is_real) {
                            openDerivRealAccountNeededModal();
                        } else {
                            setAccountType({
                                category: selected_account_type,
                                type: 'all',
                            });
                            setAppstorePlatform('dxtrade');
                            getAccount();
                        }
                    }}
                />
            )}
        </React.Fragment>
    );
});

export default WalletOtherCFDContent;
