import React from 'react';
import { useCtraderAccountsList } from '@deriv/api-v2';
import { LabelPairedChevronRightCaptionRegularIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import { TradingAccountCard } from '../../../../../components';
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
                        <Text size='sm'>{PlatformDetails.ctrader.title}</Text>
                        <Text size='sm' weight='bold'>
                            {account?.display_balance}
                        </Text>
                        <Text size='xs'>{account.login}</Text>
                    </div>
                </TradingAccountCard>
            ))}
        </React.Fragment>
    );
};

export default AddedCTraderAccountsList;
