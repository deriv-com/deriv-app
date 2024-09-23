import React from 'react';
import { useDxtradeAccountsList } from '@deriv/api-v2';
import { LabelPairedChevronRightCaptionRegularIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import { TradingAccountCard } from '../../../../../../components';
import { useModal } from '../../../../../../components/ModalProvider';
import { PlatformDetails } from '../../../../constants';
import { MT5TradeModal } from '../../../../modals';

const AddedDxtradeAccountsList: React.FC = () => {
    const { data } = useDxtradeAccountsList();
    const { show } = useModal();

    return (
        <React.Fragment>
            {data?.map((account, index) => (
                <TradingAccountCard
                    key={`added-dxtrade-${account?.login}-${index}`}
                    onClick={() => show(<MT5TradeModal platform={PlatformDetails.dxtrade.platform} />)}
                >
                    <TradingAccountCard.Icon>{PlatformDetails.dxtrade.icon}</TradingAccountCard.Icon>
                    <TradingAccountCard.Content>
                        <Text size='sm'>{PlatformDetails.dxtrade.title}</Text>
                        <Text size='sm' weight='bold'>
                            {account?.display_balance}
                        </Text>
                        <Text size='xs'>{account?.login}</Text>
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
