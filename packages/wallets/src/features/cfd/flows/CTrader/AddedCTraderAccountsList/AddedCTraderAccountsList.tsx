import React from 'react';
import { useHistory } from 'react-router-dom';
import { useCtraderAccountsList } from '@deriv/api';
import { TradingAccountCard } from '../../../../../components';
import { WalletButton, WalletText } from '../../../../../components/Base';
import { useModal } from '../../../../../components/ModalProvider';
import CTrader from '../../../../../public/images/ctrader.svg';
import { PlatformDetails } from '../../../constants';
import { MT5TradeModal } from '../../../modals';
import './AddedCTraderAccountsList.scss';

const AddedCTraderAccountsList: React.FC = () => {
    const history = useHistory();
    const { data: cTraderAccounts } = useCtraderAccountsList();
    const { show } = useModal();

    const leading = () => (
        <div className='wallets-added-ctrader-accounts__icon'>
            <CTrader />
        </div>
    );

    const trailing = () => (
        <div className='wallets-added-ctrader-accounts__actions'>
            <WalletButton
                onClick={() => {
                    history.push('/wallets/cashier/transfer');
                }}
                text='Transfer'
                variant='outlined'
            />
            <WalletButton onClick={() => show(<MT5TradeModal platform='ctrader' />)} text='Open' />
        </div>
    );

    return (
        <div className='wallets-added-ctrader-accounts'>
            <TradingAccountCard leading={leading} trailing={trailing}>
                <div className='wallets-added-ctrader-accounts__details'>
                    {cTraderAccounts?.map(account => (
                        <React.Fragment key={`added-ctrader-${account.login}`}>
                            <WalletText size='sm'>{PlatformDetails.ctrader.title}</WalletText>
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
