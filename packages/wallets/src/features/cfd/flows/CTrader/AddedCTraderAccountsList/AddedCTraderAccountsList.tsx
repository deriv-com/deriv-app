import React from 'react';
import { useCtraderAccountsList } from '@deriv/api-v2';
import { LabelPairedChevronRightCaptionRegularIcon } from '@deriv/quill-icons';
import { TradingAccountCard } from '../../../../../components';
import { WalletText } from '../../../../../components/Base';
import { useModal } from '../../../../../components/ModalProvider';
import { PlatformDetails } from '../../../constants';
import { MT5TradeModal } from '../../../modals';
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
                    onClick={() => show(<MT5TradeModal platform={PlatformDetails.ctrader.platform} />)}
                    trailing={
                        <div className='wallets-added-ctrader__icon'>
                            <LabelPairedChevronRightCaptionRegularIcon width={16} />
                        </div>
                    }
                >
                    <div className='wallets-added-ctrader__details'>
                        <WalletText size='sm'>{PlatformDetails.ctrader.title}</WalletText>
                        <WalletText size='sm' weight='bold'>
                            {account?.display_balance}
                        </WalletText>
                        <WalletText size='xs'>{account.login}</WalletText>
                    </div>
                </TradingAccountCard>
            ))}
        </React.Fragment>
    );
};

export default AddedCTraderAccountsList;
