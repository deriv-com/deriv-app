import React from 'react';
import { useDxtradeAccountsList } from '@deriv/api';
import DerivX from '../../../public/images/derivx.svg';
import { PrimaryActionButton } from '../../PrimaryActionButton';
import { TradingAccountCard } from '../../TradingAccountCard';
import './AddedDxtradeAccountsList.scss';

const AddedDxtradeAccountsList: React.FC = () => {
    const { data } = useDxtradeAccountsList();

    return (
        <TradingAccountCard
            leading={() => (
                <div className='wallets-available-derivx__icon'>
                    <DerivX />
                </div>
            )}
            trailing={() => (
                <div className='wallets-available-derivx__actions'>
                    <PrimaryActionButton className='wallets-available-derivx__transfer_button'>
                        <p className='wallets-available-derivx__transfer_text'>Transfer</p>
                    </PrimaryActionButton>
                    <PrimaryActionButton>
                        <p className='wallets-available-derivx__open_text'>Open</p>
                    </PrimaryActionButton>
                </div>
            )}
        >
            <div className='wallets-available-derivx__details'>
                {data?.map(account => (
                    <React.Fragment key={account?.account_id}>
                        <p className='wallets-available-derivx__details-title'>Deriv X</p>
                        <p className='wallets-available-derivx__details-balance'>
                            {account?.display_balance} {account?.currency}
                        </p>
                        <p className='wallets-available-derivx__details-loginid'>{account.login}</p>
                    </React.Fragment>
                ))}
            </div>
        </TradingAccountCard>
    );
};

export default AddedDxtradeAccountsList;
