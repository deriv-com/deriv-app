import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDxtradeAccountsList } from '@deriv/api';
import { TradingAccountCard } from '../../../../../../components';
import { WalletButton } from '../../../../../../components/Base';
import DerivX from '../../../../../../public/images/derivx.svg';
import './AddedDxtradeAccountsList.scss';

const AddedDxtradeAccountsList: React.FC = () => {
    const history = useHistory();
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
                    <WalletButton
                        onClick={() => {
                            history.push('/wallets/cashier/transfer');
                        }}
                        text='Transfer'
                        variant='outlined'
                    />
                    <WalletButton text='Open' />
                </div>
            )}
        >
            <div className='wallets-available-derivx__details'>
                {data?.map(account => (
                    <React.Fragment key={account?.account_id}>
                        <p className='wallets-available-derivx__details-title'>Deriv X</p>
                        <p className='wallets-available-derivx__details-balance'>{account?.display_balance}</p>
                        <p className='wallets-available-derivx__details-loginid'>{account.login}</p>
                    </React.Fragment>
                ))}
            </div>
        </TradingAccountCard>
    );
};

export default AddedDxtradeAccountsList;
