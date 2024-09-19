import React from 'react';
import { useCtraderAccountsList } from '@deriv/api-v2';
import { LabelPairedChevronRightCaptionRegularIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import { TradingAccountCard } from '../../../../../components';
import { useModal } from '../../../../../components/ModalProvider';
import { PlatformDetails } from '../../../constants';
import { MT5TradeModal } from '../../../modals';

const AddedCTraderAccountsList: React.FC = () => {
    const { data: cTraderAccounts } = useCtraderAccountsList();
    const { show } = useModal();

    return (
        <React.Fragment>
            {cTraderAccounts?.map((account, index) => (
                <TradingAccountCard
                    key={`added-ctrader-${account.login}-${index}`}
                    onClick={() => show(<MT5TradeModal platform={PlatformDetails.ctrader.platform} />)}
                >
                    <TradingAccountCard.Icon>{PlatformDetails.ctrader.icon}</TradingAccountCard.Icon>
                    <TradingAccountCard.Content>
                        <Text size='sm'>{PlatformDetails.ctrader.title}</Text>
                        <Text size='sm' weight='bold'>
                            {account?.display_balance}
                        </Text>
                        <Text size='xs'>{account.login}</Text>
                    </TradingAccountCard.Content>
                    <TradingAccountCard.Button>
                        <LabelPairedChevronRightCaptionRegularIcon width={16} />
                    </TradingAccountCard.Button>
                </TradingAccountCard>
            ))}
        </React.Fragment>
    );
};

export default AddedCTraderAccountsList;
