import React from 'react';
import { useSortedMT5Accounts } from '@deriv/api';
import { AddedMT5AccountsList } from '../AddedMT5AccountsList';
import { AvailableMT5AccountsList } from '../AvailableMT5AccountsList';
import './MT5PlatformsList.scss';

const MT5PlatformsList: React.FC = () => {
    const { data } = useSortedMT5Accounts();

    if (!data) return <span className='wallets-mt5-loader' />;

    return (
        <React.Fragment>
            <div className='wallets-mt5-list'>
                <div className='wallets-mt5-list__title'>
                    <h1>Deriv MT5</h1>
                </div>
            </div>
            <div className='wallets-mt5-list__content'>
                {data?.map((account, index) => {
                    if (account.is_added)
                        return (
                            <AddedMT5AccountsList account={account} key={`added-mt5-list${account.loginid}-${index}`} />
                        );

                    return (
                        <AvailableMT5AccountsList
                            account={account}
                            key={`available-mt5-list${account.name}-${index}`}
                        />
                    );
                })}
            </div>
        </React.Fragment>
    );
};

export default MT5PlatformsList;
