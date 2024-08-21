import React from 'react';
import { useDxtradeAccountsList } from '@deriv/api-v2';
import { LabelPairedChevronRightCaptionRegularIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import { TradingAccountCard } from '../../../../../../components';
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
                    leading={<div className='wallets-added-dxtrade__icon'>{PlatformDetails.dxtrade.icon}</div>}
                    onClick={() => show(<MT5TradeModal platform={PlatformDetails.dxtrade.platform} />)}
                    trailing={
                        <div className='wallets-added-dxtrade__icon'>
                            <LabelPairedChevronRightCaptionRegularIcon width={16} />
                        </div>
                    }
                >
                    <div className='wallets-added-dxtrade__details'>
                        <Text size='sm'>{PlatformDetails.dxtrade.title}</Text>
                        <Text size='sm' weight='bold'>
                            {account?.display_balance}
                        </Text>
                        <Text size='xs'>{account?.login}</Text>
                    </div>
                </TradingAccountCard>
            ))}
        </React.Fragment>
    );
};

export default AddedDxtradeAccountsList;
