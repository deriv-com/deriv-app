import React from 'react';
import { useCtraderAccountsList } from '@deriv/api-v2';
import { TradingAccountCard } from '../../../../../components';
import { WalletButton, WalletButtonGroup, WalletText } from '../../../../../components/Base';
import { useModal } from '../../../../../components/ModalProvider';
import { PlatformDetails } from '../../../constants';
import { CTraderTradeModal } from '../../../modals';
import './AddedCTraderAccountsList.scss';

const AddedCTraderAccountsList: React.FC = () => {
    const { data: cTraderAccounts } = useCtraderAccountsList();
    const { show } = useModal();

    return (
        <React.Fragment>
            {cTraderAccounts?.map(account => (
                <TradingAccountCard
                    key={`added-ctrader-${account.login}`}
                    leading={<div className='wallets-added-ctrader__icon'>{PlatformDetails.ctrader.icon}</div>}
                    onClick={() => show(<CTraderTradeModal platform={PlatformDetails.ctrader.platform} />)}
                    trailing={
                        <WalletButtonGroup isVertical>
                            <WalletButton variant='outlined'>Transfer</WalletButton>
                            <WalletButton>Open</WalletButton>
                        </WalletButtonGroup>
                    }
                >
                    <div className='wallets-added-ctrader__details'>
                        <WalletText size='sm'>{PlatformDetails.ctrader.title}</WalletText>
                        <WalletText size='sm' weight='bold'>
                            {account?.formatted_balance}
                        </WalletText>
                        <WalletText size='xs'>{account.login}</WalletText>
                    </div>
                </TradingAccountCard>
            ))}
        </React.Fragment>
    );
};

export default AddedCTraderAccountsList;
