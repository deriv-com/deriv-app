import React from 'react';
import { localize } from '@deriv/translations';
import TradingAppCard from 'Components/containers/trading-app-card';
import { getHasDivider } from 'Constants/utils';
import { useStore, observer } from '@deriv/stores';
import { useActiveWallet, useFilteredCFDAccounts } from '@deriv/hooks';
import GetMoreAccounts from 'Components/get-more-accounts';
import { mt5_details_mapper } from '../../helpers/account-helper';

const WalletFiatMT5Content = observer(() => {
    const {
        client,
        modules: { cfd },
        traders_hub,
        ui,
        common,
    } = useStore();
    const {
        selected_region,
        selected_account_type,
        toggleAccountTypeModalVisibility,
        is_eu_user,
        is_demo,
        getAccount,
        toggleAccountTransferModal,
        setSelectedAccount,
        showTopUpModal,
        startTrade,
        openFailedVerificationModal,
        can_get_more_cfd_mt5_accounts,
        no_MF_account,
        is_real,
        no_CR_account,
    } = traders_hub;

    const { setAccountType } = cfd;
    const { setAppstorePlatform } = common;
    const { real_account_creation_unlock_date } = client;
    const { setShouldShowCooldownModal, openDerivRealAccountNeededModal } = ui;

    const wallet = useActiveWallet();

    const { data: filtered_cfd_accounts } = useFilteredCFDAccounts();

    const getMT5AccountAuthStatus = (current_acc_status: string) => {
        if (current_acc_status === 'proof_failed') {
            return 'failed';
        } else if (current_acc_status === 'verification_pending') {
            return 'pending';
        }
        return null;
    };

    const no_real_mf_account_eu_regulator = no_MF_account && is_eu_user && is_real;

    const no_real_cr_non_eu_regulator = no_CR_account && !is_eu_user && is_real;

    return (
        <React.Fragment>
            {filtered_cfd_accounts?.map((existing_account, index) => {
                const list_size = filtered_cfd_accounts.length || 0;
                const has_mt5_account_status = existing_account.status
                    ? getMT5AccountAuthStatus(existing_account.status)
                    : null;

                return existing_account.is_added ? (
                    <TradingAppCard
                        action_type='multi-action'
                        availability={selected_region}
                        clickable_icon
                        icon={existing_account.icon}
                        sub_title={existing_account?.sub_title}
                        name={!has_mt5_account_status ? existing_account?.name : ''}
                        platform={existing_account.platform}
                        description={existing_account.description}
                        key={existing_account.login}
                        has_divider={(!is_eu_user || is_demo) && getHasDivider(index, list_size, 3)}
                        onAction={(e?: React.MouseEvent<HTMLButtonElement>) => {
                            const button_name = e?.currentTarget?.name;
                            if (button_name === 'transfer-btn') {
                                toggleAccountTransferModal();
                                setSelectedAccount(existing_account);
                            } else if (button_name === 'topup-btn') {
                                showTopUpModal(existing_account);
                                setAppstorePlatform(existing_account.platform);
                            } else {
                                startTrade(existing_account.platform, existing_account);
                            }
                        }}
                        mt5_acc_auth_status={has_mt5_account_status}
                        selected_mt5_jurisdiction={{
                            platform: existing_account.platform,
                            category: selected_account_type,
                            type: existing_account.market_type,
                            jurisdiction: existing_account.landing_company_short,
                        }}
                        openFailedVerificationModal={openFailedVerificationModal}
                        is_wallet={wallet?.is_selected}
                        is_wallet_demo={!!wallet?.is_demo}
                    />
                ) : (
                    <TradingAppCard
                        action_type='get'
                        availability={selected_region}
                        clickable_icon
                        icon={existing_account.icon}
                        name={mt5_details_mapper[existing_account.market_type]?.name}
                        platform={existing_account.platform}
                        description={mt5_details_mapper[existing_account.market_type]?.description}
                        key={`trading_app_card_${existing_account.login}`}
                        is_wallet={true}
                        is_wallet_demo={wallet?.is_demo}
                        onAction={() => {
                            if (real_account_creation_unlock_date && no_real_mf_account_eu_regulator) {
                                setShouldShowCooldownModal(true);
                            } else if (no_real_cr_non_eu_regulator || no_real_mf_account_eu_regulator) {
                                openDerivRealAccountNeededModal();
                            } else {
                                setAccountType({
                                    category: selected_account_type,
                                    type: existing_account.market_type,
                                });
                                setAppstorePlatform(existing_account.platform);
                                getAccount();
                            }
                        }}
                    />
                );
            })}
            {can_get_more_cfd_mt5_accounts && (
                <GetMoreAccounts
                    onClick={toggleAccountTypeModalVisibility}
                    icon='IcAppstoreGetMoreAccounts'
                    title={localize('Get more')}
                    description={localize('Get more Deriv MT5 account with different type and jurisdiction.')}
                />
            )}
        </React.Fragment>
    );
});

export default WalletFiatMT5Content;
