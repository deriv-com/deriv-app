import React from 'react';
import { CaptionText, Text } from '@deriv-com/quill-ui';
import EntryExitDetails from 'AppV2/Components/EntryExitDetails';
import TakeProfitHistory from 'AppV2/Components/TakeProfitHistory';
import PayoutInfo from 'AppV2/Components/PayoutInfo';
import ChartPlaceholder from '../Chart';
import { Localize } from '@deriv/translations';
import RiskManagementItem from 'AppV2/Components/RiskManagementItem';
import CardWrapper from 'AppV2/Components/CardWrapper';
import { observer } from '@deriv/stores';
import useContractDetails from 'AppV2/Hooks/useContractDetails';
import { isValidToCancel } from '@deriv/shared';
import OrderDetails from 'AppV2/Components/OrderDetails';

const ContractDetails = observer(() => {
    const { contract_info, is_loading } = useContractDetails();
    if (is_loading) return <></>;
    const is_valid_to_cancel = isValidToCancel(contract_info);
    const historyData = [
        { date: '01 Jan 2024', time: '12:00:00 GMT', action: 'Take profit', amount: '5.00 USD' },
        { date: '02 Jan 2024', time: '13:00:00 GMT', action: 'Take profit', amount: '10.00 USD' },
        { date: '03 Jan 2024', time: '12:00:00 GMT', action: 'Stop loss', amount: '5.00 USD' },
        { date: '04 Jan 2024', time: '13:00:00 GMT', action: 'Take profit', amount: '10.00 USD' },
        { date: '05 Jan 2024', time: '12:00:00 GMT', action: 'Take profit', amount: '5.00 USD' },
        { date: '06 Jan 2024', time: '13:00:00 GMT', action: 'Take profit', amount: '10.00 USD' },
    ];
    return (
        <div className='contract-details'>
            {/* TODO: remove temp contract card */}
            <div className='contract-card'>
                <div className='row first-row'>
                    <div className='title'>
                        <Text size='sm'>Accumulators</Text>
                    </div>
                </div>
                <div className='row'>
                    <CaptionText>Volatility 75 Index</CaptionText>
                    <CaptionText size='sm'>10.00 USD</CaptionText>
                </div>
                <div className='row last-row'>
                    <div className='column'>
                        <Text size='sm'>2/150 ticks</Text>
                    </div>
                    <div className='column'>
                        <Text size='sm' className='red'>
                            -1.00 USD
                        </Text>
                    </div>
                </div>
            </div>
            {/* END OF CONTRACT CARD */}
            <div className='placeholder'>
                <ChartPlaceholder />
            </div>
            {is_valid_to_cancel && (
                <CardWrapper>
                    <RiskManagementItem
                        label={<Localize i18n_default_text='Deal cancellation' />}
                        modal_body_content={<Localize i18n_default_text='Whatever you desire' />}
                        validation_message='hello'
                        is_deal_cancellation
                    />
                </CardWrapper>
            )}
            <div className='placeholder'>
                <OrderDetails contract_info={contract_info} />
            </div>
            <CardWrapper>
                <RiskManagementItem
                    label={<Localize i18n_default_text='Deal cancellation' />}
                    modal_body_content={<Localize i18n_default_text='Whatever you desire' />}
                    validation_message='hello'
                    is_deal_cancellation
                />
            </CardWrapper>
            <CardWrapper>
                <RiskManagementItem
                    label={<Localize i18n_default_text='Take profit' />}
                    modal_body_content={<Localize i18n_default_text='Whatever you desire' />}
                    validation_message='hello'
                />
                <RiskManagementItem
                    label={<Localize i18n_default_text='Stop Loss' />}
                    modal_body_content={<Localize i18n_default_text='Whatever you desire' />}
                    validation_message='hello'
                />
            </CardWrapper>
            <PayoutInfo contract_info={contract_info} />
            <EntryExitDetails />
            <TakeProfitHistory history={historyData} />
        </div>
    );
});

export default ContractDetails;
