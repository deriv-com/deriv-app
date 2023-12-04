import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDxtradeAccountsList } from '@deriv/api';
import { TradingAccountCard } from '../../../../../../components';
import { WalletButton, WalletText } from '../../../../../../components/Base';
import { useModal } from '../../../../../../components/ModalProvider';
import { getStaticUrl } from '../../../../../../helpers/urls';
import DerivX from '../../../../../../public/images/derivx.svg';
import { MT5TradeModal } from '../../../../modals';
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
                        variant='outlined'
                    >
                        Transfer
                    </WalletButton>
                    <WalletButton onClick={() => show(<MT5TradeModal platform='dxtrade' />)}>Open</WalletButton>
                </div>
            )}
        >
            <div className='wallets-available-derivx__details'>
                {data?.map(account => (
                    <React.Fragment key={account?.account_id}>
                        <WalletText size='sm'>Deriv X</WalletText>
                        <WalletText size='sm' weight='bold'>
                            {account?.display_balance}
                        </WalletText>
                        <WalletText color='primary' size='xs' weight='bold'>
                            {account?.login}
                        </WalletText>
                    </React.Fragment>
                ))}
            </div>
        </TradingAccountCard>
    );
};

export default AddedDxtradeAccountsList;
