import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDxtradeAccountsList } from '@deriv/api';
import { MT5TradeModal } from '../../../../modals';
import { TradingAccountCard } from '../../../../../../components';
import { useModal } from '../../../../../../components/ModalProvider';
import { WalletButton } from '../../../../../../components/Base';
import { getStaticUrl } from '../../../../../../helpers/urls';
import DerivX from '../../../../../../public/images/derivx.svg';
import './AddedDxtradeAccountsList.scss';

const AddedDxtradeAccountsList: React.FC = () => {
    const history = useHistory();
    const { data } = useDxtradeAccountsList();
    const { show } = useModal();

    return (
        <TradingAccountCard
            leading={() => (
                <div
                    className='wallets-available-derivx__icon'
                    onClick={() => {
                        window.open(getStaticUrl('/derivx'));
                    }}
                >
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
                    <WalletButton onClick={() => show(<MT5TradeModal platform='dxtrade' />)} text='Open' />
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
