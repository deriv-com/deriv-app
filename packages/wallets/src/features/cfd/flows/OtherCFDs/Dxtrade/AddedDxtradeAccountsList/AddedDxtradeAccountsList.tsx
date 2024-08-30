import React from 'react';
import { useDxtradeAccountsList } from '@deriv/api-v2';
import {
    LabelPairedChevronLeftCaptionRegularIcon,
    LabelPairedChevronRightCaptionRegularIcon,
} from '@deriv/quill-icons';
import { TradingAccountCard } from '../../../../../../components';
import { WalletText } from '../../../../../../components/Base';
import { useModal } from '../../../../../../components/ModalProvider';
import useIsRtl from '../../../../../../hooks/useIsRtl';
import { PlatformDetails } from '../../../../constants';
import { MT5TradeModal } from '../../../../modals';

const AddedDxtradeAccountsList: React.FC = () => {
    const { data } = useDxtradeAccountsList();
    const { show } = useModal();
    const isRtl = useIsRtl();

    return (
        <React.Fragment>
            {data?.map(account => (
                <TradingAccountCard
                    key={account?.account_id}
                    onClick={() => show(<MT5TradeModal platform={PlatformDetails.dxtrade.platform} />)}
                >
                    <TradingAccountCard.Icon>{PlatformDetails.dxtrade.icon}</TradingAccountCard.Icon>
                    <TradingAccountCard.Content>
                        <WalletText size='sm'>{PlatformDetails.dxtrade.title}</WalletText>
                        <WalletText size='sm' weight='bold'>
                            {account?.display_balance}
                        </WalletText>
                        <WalletText size='xs'>{account?.login}</WalletText>
                    </TradingAccountCard.Content>
                    <TradingAccountCard.Button>
                        {isRtl ? (
                            <LabelPairedChevronLeftCaptionRegularIcon width={16} />
                        ) : (
                            <LabelPairedChevronRightCaptionRegularIcon width={16} />
                        )}
                    </TradingAccountCard.Button>
                </TradingAccountCard>
            ))}
        </React.Fragment>
    );
};

export default AddedDxtradeAccountsList;
