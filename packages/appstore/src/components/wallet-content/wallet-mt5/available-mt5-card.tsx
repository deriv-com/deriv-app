import React from 'react';
import { useStore, observer } from '@deriv/stores';
import { useActiveWallet, useFilteredCFDAccounts } from '@deriv/hooks';
import TradingAppCard from 'Components/containers/trading-app-card';
import { mt5_details_mapper } from '../../../helpers/account-helper';

const AvailableMT5Card = observer(
    ({ account }: { account: NonNullable<ReturnType<typeof useFilteredCFDAccounts>['data']>[number] }) => {
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
            is_eu_user,
            getAccount,
            no_MF_account,
            is_real,
            no_CR_account,
        } = traders_hub;

        const { setAccountType } = cfd;
        const { setAppstorePlatform } = common;
        const { real_account_creation_unlock_date } = client;
        const { setShouldShowCooldownModal, openDerivRealAccountNeededModal } = ui;

        const wallet = useActiveWallet();

        const no_real_mf_account_eu_regulator = no_MF_account && is_eu_user && is_real;

        const no_real_cr_non_eu_regulator = no_CR_account && !is_eu_user && is_real;

        const { market_type } = account;

        const mapper_content = mt5_details_mapper[market_type as keyof typeof mt5_details_mapper];

        return (
            <TradingAppCard
                action_type='get'
                availability={selected_region}
                clickable_icon
                icon={account.icon}
                name={mapper_content?.name}
                platform={account.platform}
                description={mapper_content?.description}
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
                            type: account.market_type,
                        });
                        setAppstorePlatform(account.platform);
                        getAccount();
                    }
                }}
            />
        );
    }
);

export default AvailableMT5Card;
