import React from 'react';
import { useDxtradeAccountsList } from '@deriv/api';
import { TradingAccountCard } from '../../../../../../components';
import { WalletButton, WalletText } from '../../../../../../components/Base';
import DerivX from '../../../../../../public/images/derivx.svg';
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
                    <WalletButton variant='outlined'>
                        <WalletText align='center' size='sm' weight='bold'>
                            Transfer
                        </WalletText>
                    </WalletButton>
                    <WalletButton>
                        <WalletText align='center' color='white' size='sm' weight='bold'>
                            Open
                        </WalletText>
                    </WalletButton>
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
