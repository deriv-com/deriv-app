import React from 'react';
import { localize } from '@deriv/translations';
import { useStore, observer } from '@deriv/stores';
import { useFilteredCFDAccounts, useCFDCanGetMoreMT5Accounts } from '@deriv/hooks';
import GetMoreAccounts from 'Components/get-more-accounts';
import PlatformLoader from 'Components/pre-loader/platform-loader';
import WalletMT5CardList from './wallet-mt5/wallet-mt5-card-list';

const WalletFiatMT5Content = observer(() => {
    const { traders_hub, client } = useStore();
    const { is_authorize } = client;
    const { toggleAccountTypeModalVisibility } = traders_hub;
    const { isFetchedAfterMount } = useFilteredCFDAccounts();
    const can_get_more_cfd_mt5_accounts = useCFDCanGetMoreMT5Accounts();

    return (
        <React.Fragment>
            {!isFetchedAfterMount && is_authorize && (
                <div className='wallet-content__loader'>
                    <PlatformLoader />
                </div>
            )}
            {isFetchedAfterMount && <WalletMT5CardList />}
            {isFetchedAfterMount && can_get_more_cfd_mt5_accounts && (
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
