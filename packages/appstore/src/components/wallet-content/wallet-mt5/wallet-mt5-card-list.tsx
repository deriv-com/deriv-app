import React from 'react';
import { observer } from '@deriv/stores';
import { useFilteredCFDAccounts } from '@deriv/hooks';
import AddedMT5Card from './added-mt5-card';
import AvailableMT5Card from './available-mt5-card';
import PlatformLoader from 'Components/pre-loader/platform-loader';
// import { useModal } from 'src/wallets-cfd/context/ModalProvider';
// import JurisdictionModal from 'src/wallets-cfd/components/modals/jurisdiction-modal/jurisdiction-modal';

const market_types = ['gaming', 'synthetic', 'financial', 'all'];

const WalletMT5CardList = observer(() => {
    const { data: filtered_cfd_accounts, isFetchedAfterMount } = useFilteredCFDAccounts();
    // const { show } = useModal();

    if (!isFetchedAfterMount)
        return (
            <div className='wallet-content__loader'>
                <PlatformLoader />
            </div>
        );
    return (
        <React.Fragment>
            {filtered_cfd_accounts &&
                market_types.map(market_type => {
                    const accounts = filtered_cfd_accounts[market_type];

                    return accounts?.map((account, index) => {
                        const list_size = accounts.length || 0;

                        if (account.is_added) {
                            return (
                                <AddedMT5Card
                                    key={`${account.login}`}
                                    account={account}
                                    index={index}
                                    list_size={list_size}
                                />
                            );
                        }
                        return (
                            <>
                                <AvailableMT5Card key={`${account.market_type}${account.loginid}`} account={account} />
                                {/* <button onClick={() => show(<AvailableMT5Card account={account} />)}>
                                    toggle modal
                                </button> */}
                            </>
                        );
                    });
                })}
        </React.Fragment>
    );
});

export default WalletMT5CardList;
