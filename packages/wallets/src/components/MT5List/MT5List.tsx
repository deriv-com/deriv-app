import React from 'react';
import { useSortedMT5Accounts } from '@deriv/api';
import { AddedMT5AccountsList } from '../AddedMT5AccountsList';
import { AvailableMT5AccountsList } from '../AvailableMT5AccountsList';
import './MT5List.scss';

const MT5List: React.FC = () => {
    const { data } = useSortedMT5Accounts();

    if (!data) return <span className='wallets-mt5-loader' />;

    return (
        <React.Fragment>
            <section className='wallets-mt5-list'>
                <div className='wallets-mt5-list__title'>
                    <h1>Deriv MT5</h1>
                </div>
            </section>
            <div className='wallets-mt5-list__content'>
                {data?.map((account, index) => {
                    if (account.is_added)
                        return (
                            <AddedMT5AccountsList key={`added-mt5-list${account.loginid}-${index}`} account={account} />
                        );

                    return (
                        <AvailableMT5AccountsList
                            key={`available-mt5-list${account.name}-${index}`}
                            account={account}
                        />
                    );
                })}
            </div>
        </React.Fragment>
    );
};

export default MT5List;
