import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDxtradeAccountsList } from '@deriv/api';
import { TradingAccountCard } from '../../../../../../components';
import { WalletButton, WalletText } from '../../../../../../components/Base';
import { useModal } from '../../../../../../components/ModalProvider';
import { getStaticUrl } from '../../../../../../helpers/urls';
import DerivX from '../../../../../../public/images/derivx.svg';
import { PlatformDetails } from '../../../../constants';
import { MT5TradeModal } from '../../../../modals';
import './AddedDxtradeAccountsList.scss';

const AddedDxtradeAccountsList: React.FC = () => {
    const history = useHistory();
    const { data } = useDxtradeAccountsList();
    const { show } = useModal();

    const leadingComponent = () => (
        <div
            className='wallets-available-derivx__icon'
            onClick={() => {
                window.open(getStaticUrl('/derivx'));
            }}
            // Fix sonarcloud issue
            onKeyDown={event => {
                if (event.key === 'Enter') {
                    window.open(getStaticUrl('/derivx'));
                }
            }}
        >
            <DerivX />
        </div>
    );

    const trailingComponent = () => (
        <div className='wallets-available-derivx__actions'>
            <WalletButton
                onClick={() => {
                    history.push('/wallets/cashier/transfer');
                }}
                variant='outlined'
            >
                Transfer
            </WalletButton>
            <WalletButton onClick={() => show(<MT5TradeModal platform={PlatformDetails.dxtrade.platform} />)}>
                Open
            </WalletButton>
        </div>
    );

    return (
        <TradingAccountCard leading={leadingComponent} trailing={trailingComponent}>
            <div className='wallets-available-derivx__details'>
                {data?.map(account => (
                    <React.Fragment key={account?.account_id}>
                        <WalletText size='sm'>{PlatformDetails.dxtrade.title}</WalletText>
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
