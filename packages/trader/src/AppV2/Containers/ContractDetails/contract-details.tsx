import React, { useMemo } from 'react';
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
import { hasContractStarted, isForwardStarting, isMultiplierContract, isOpen, isValidToCancel } from '@deriv/shared';
import OrderDetails from 'AppV2/Components/OrderDetails';
import { getContractDetailsConfig } from 'AppV2/Utils/contract-details-config';
import ContractDetailsFooter from 'AppV2/Components/ContractDetailsFooter';
import classNames from 'classnames';

const historyData = [
    { date: '01 Jan 2024', time: '12:00:00 GMT', action: 'Take profit', amount: '5.00 USD' },
    { date: '02 Jan 2024', time: '13:00:00 GMT', action: 'Take profit', amount: '10.00 USD' },
    { date: '03 Jan 2024', time: '12:00:00 GMT', action: 'Stop loss', amount: '5.00 USD' },
    { date: '04 Jan 2024', time: '13:00:00 GMT', action: 'Take profit', amount: '10.00 USD' },
    { date: '05 Jan 2024', time: '12:00:00 GMT', action: 'Take profit', amount: '5.00 USD' },
    { date: '06 Jan 2024', time: '13:00:00 GMT', action: 'Take profit', amount: '10.00 USD' },
];

const ContractDetails = observer(() => {
    const { contract_info, is_loading } = useContractDetails();
    if (is_loading) return <></>;
    const is_multiplier = isMultiplierContract(contract_info.contract_type);
    const is_valid_to_cancel = isValidToCancel(contract_info);
    const { is_deal_cancellation_visible, is_stop_loss_visible, is_take_profit_visible, is_tp_history_visible } =
        getContractDetailsConfig(contract_info.contract_type ?? '');

    const should_show_sell =
        (hasContractStarted(contract_info) ||
            isForwardStarting(contract_info?.shortcode ?? '', contract_info.purchase_time)) &&
        isOpen(contract_info);

    const show_cancel_button = is_multiplier && is_valid_to_cancel;

    return (
        <div
            className={classNames('contract-details', {
                'contract-details--two-buttons': should_show_sell && show_cancel_button,
                'contract-details--one-button': should_show_sell && !show_cancel_button,
            })}
        >
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

            <ChartPlaceholder />
            {is_valid_to_cancel && is_deal_cancellation_visible && (
                <CardWrapper>
                    <RiskManagementItem
                        label={<Localize i18n_default_text='Deal cancellation' />}
                        modal_body_content={<Localize i18n_default_text='Whatever you desire' />}
                        validation_message='hello'
                        is_deal_cancellation
                    />
                </CardWrapper>
            )}
            <CardWrapper>
                {is_take_profit_visible && (
                    <RiskManagementItem
                        label={<Localize i18n_default_text='Take profit' />}
                        modal_body_content={<Localize i18n_default_text='Whatever you desire' />}
                        validation_message='hello'
                    />
                )}
                {is_stop_loss_visible && (
                    <RiskManagementItem
                        label={<Localize i18n_default_text='Stop Loss' />}
                        modal_body_content={<Localize i18n_default_text='Whatever you desire' />}
                        validation_message='hello'
                    />
                )}
            </CardWrapper>
            <CardWrapper title='Order Details'>
                <OrderDetails contract_info={contract_info} />
            </CardWrapper>
            <PayoutInfo contract_info={contract_info} />
            <EntryExitDetails contract_info={contract_info} />
            {is_tp_history_visible && <TakeProfitHistory history={historyData} />}
            {should_show_sell && <ContractDetailsFooter contract_info={contract_info} />}
        </div>
    );
});

export default ContractDetails;
