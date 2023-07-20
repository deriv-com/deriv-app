import React from 'react';
import TradingAppCard from 'Components/containers/trading-app-card';
import { getHasDivider } from 'Constants/utils';
import { useStore, observer } from '@deriv/stores';
import { useActiveWallet } from '@deriv/hooks';
import { TFilteredWalletMT5Account } from 'Types';

const AddedMT5Card = observer(
    ({ account, index, list_size }: { account: TFilteredWalletMT5Account; index: number; list_size: number }) => {
        const { traders_hub, common } = useStore();
        const {
            selected_region,
            selected_account_type,
            is_eu_user,
            is_demo,
            toggleAccountTransferModal,
            setSelectedAccount,
            showTopUpModal,
            startTrade,
            openFailedVerificationModal,
        } = traders_hub;
        const { setAppstorePlatform } = common;

        const wallet = useActiveWallet();

        const getMT5AccountAuthStatus = (current_acc_status: string) => {
            if (current_acc_status === 'proof_failed') {
                return 'failed';
            } else if (current_acc_status === 'verification_pending') {
                return 'pending';
            }
            return null;
        };

        const has_mt5_account_status = account.status ? getMT5AccountAuthStatus(account.status) : null;

        return (
            <TradingAppCard
                action_type='multi-action'
                availability={selected_region}
                clickable_icon
                icon={account.icon}
                sub_title={account?.sub_title}
                name={!has_mt5_account_status ? account?.name : ''}
                platform={account.platform}
                description={account.description}
                short_code_and_region={account.short_code_and_region}
                has_divider={(!is_eu_user || is_demo) && getHasDivider(index, list_size, 3)}
                onAction={(e?: React.MouseEvent<HTMLButtonElement>) => {
                    const button_name = e?.currentTarget?.name;
                    if (button_name === 'transfer-btn') {
                        toggleAccountTransferModal();
                        setSelectedAccount(account);
                    } else if (button_name === 'topup-btn') {
                        showTopUpModal(account);
                        setAppstorePlatform(account.platform);
                    } else {
                        startTrade(account.platform, account);
                    }
                }}
                mt5_acc_auth_status={has_mt5_account_status}
                selected_mt5_jurisdiction={{
                    platform: account.platform,
                    category: selected_account_type,
                    type: account.market_type,
                    jurisdiction: account.landing_company_short,
                }}
                openFailedVerificationModal={openFailedVerificationModal}
                is_wallet={wallet?.is_selected}
                is_wallet_demo={!!wallet?.is_demo}
            />
        );
    }
);

export default AddedMT5Card;
