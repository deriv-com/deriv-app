import React from 'react';
import { useDxtradeAccountsList } from '@deriv/api-v2';
import { LabelPairedChevronRightCaptionRegularIcon } from '@deriv/quill-icons';
import { TradingAccountCard } from '../../../../../../components';
import { WalletText } from '../../../../../../components/Base';
import { useModal } from '../../../../../../components/ModalProvider';
import { PlatformDetails } from '../../../../constants';
import { MT5TradeModal } from '../../../../modals';
import './AddedDxtradeAccountsList.scss';

const AddedDxtradeAccountsList: React.FC = () => {
    const { data } = useDxtradeAccountsList();
    const { show } = useModal();

    return (
        <React.Fragment>
            {data?.map(account => (
                <TradingAccountCard
                    key={account?.account_id}
                    onClick={() => show(<MT5TradeModal platform={PlatformDetails.dxtrade.platform} />)}
                >
                    <TradingAccountCard.Icon>{PlatformDetails.dxtrade.icon}</TradingAccountCard.Icon>
                    <TradingAccountCard.Content className='wallets-added-dxtrade__details'>
                        <WalletText size='sm'>{PlatformDetails.dxtrade.title}</WalletText>
                        <WalletText size='sm' weight='bold'>
                            {account?.display_balance}
                        </WalletText>
                        <WalletText size='xs'>{account?.login}</WalletText>
                    </TradingAccountCard.Content>
                    <TradingAccountCard.Button>
                        <LabelPairedChevronRightCaptionRegularIcon width={16} />
                    </TradingAccountCard.Button>
                </TradingAccountCard>
            ))}
        </React.Fragment>
    );
};

export default AddedDxtradeAccountsList;
