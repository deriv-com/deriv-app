import React from 'react';
import { useCtraderAccountsList } from '@deriv/api-v2';
import { LabelPairedChevronRightCaptionRegularIcon } from '@deriv/quill-icons';
import { TradingAccountCard } from '../../../../../components';
import { WalletText } from '../../../../../components/Base';
import { useModal } from '../../../../../components/ModalProvider';
import { PlatformDetails } from '../../../constants';
import { MT5TradeModal } from '../../../modals';

const AddedCTraderAccountsList: React.FC = () => {
    const { data: cTraderAccounts } = useCtraderAccountsList();
    const { show } = useModal();

    return (
        <React.Fragment>
            {cTraderAccounts?.map(account => (
                <TradingAccountCard
                    key={`added-ctrader-${account.login}`}
                    onClick={() => show(<MT5TradeModal platform={PlatformDetails.ctrader.platform} />)}
                >
                    <TradingAccountCard.Icon>{PlatformDetails.ctrader.icon}</TradingAccountCard.Icon>
                    <TradingAccountCard.Section>
                        <TradingAccountCard.Content>
                            <WalletText size='sm'>{PlatformDetails.ctrader.title}</WalletText>
                            <WalletText size='sm' weight='bold'>
                                {account?.display_balance}
                            </WalletText>
                            <WalletText size='xs'>{account.login}</WalletText>
                        </TradingAccountCard.Content>
                        <TradingAccountCard.Button>
                            <LabelPairedChevronRightCaptionRegularIcon width={16} />
                        </TradingAccountCard.Button>
                    </TradingAccountCard.Section>
                </TradingAccountCard>
            ))}
        </React.Fragment>
    );
};

export default AddedCTraderAccountsList;
