import React from 'react';
import { useHistory } from 'react-router-dom';
import { useCtraderAccountsList } from '@deriv/api';
import { TradingAccountCard } from '../../../../../components';
import { WalletButton, WalletText } from '../../../../../components/Base';
import CTrader from '../../../../../public/images/ctrader.svg';
import './AddedCTraderAccountsList.scss';

const AddedCTraderAccountsList: React.FC = () => {
    const history = useHistory();
    const { data: cTraderAccounts } = useCtraderAccountsList();

    return (
        <div className='wallets-added-ctrader-accounts'>
            <TradingAccountCard
                leading={() => (
                    <div className='wallets-added-ctrader-accounts__icon'>
                        <CTrader />
                    </div>
                )}
                trailing={() => (
                    <div className='wallets-added-ctrader-accounts__actions'>
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
                <div className='wallets-added-ctrader-accounts__details'>
                    {cTraderAccounts?.map(account => (
                        <React.Fragment key={`added-ctrader-${account.login}`}>
                            <WalletText size='sm'>Deriv cTrader</WalletText>
                            <WalletText size='sm' weight='bold'>
                                {account?.display_balance}
                            </WalletText>
                            <WalletText color='primary' size='sm' weight='bold'>
                                {account.login}
                            </WalletText>
                        </React.Fragment>
                    ))}
                </div>
            </TradingAccountCard>
        </div>
    );
};

export default AddedCTraderAccountsList;
