import React from 'react';
import Digits from 'Modules/Contract/Components/Digits';
import InfoBox from 'Modules/Contract/Components/InfoBox';
import { connect } from 'Stores/connect';
import BottomWidgets from '../../SmartChart/Components/bottom-widgets.jsx';
import TopWidgets from '../../SmartChart/Components/top-widgets.jsx';

export const DigitsWidget = connect(({ modules }) => ({
    contract_info: modules.contract_replay.contract_store.contract_info,
    digits_info: modules.contract_replay.contract_store.digits_info,
    display_status: modules.contract_replay.contract_store.display_status,
    is_digit_contract: modules.contract_replay.contract_store.is_digit_contract,
    is_ended: modules.contract_replay.contract_store.is_ended,
}))(({ is_digit_contract, is_ended, contract_info, digits_info, display_status }) => (
    <Digits
        is_digit_contract={is_digit_contract}
        is_ended={is_ended}
        contract_info={contract_info}
        digits_info={digits_info}
        display_status={display_status}
    />
));

export const InfoBoxWidget = connect(({ modules }) => ({
    contract_info: modules.contract_replay.contract_store.contract_info,
    error_message: modules.contract_replay.error_message,
    removeError: modules.contract_replay.removeErrorMessage,
}))(({ contract_info, error_message, removeError }) => (
    <InfoBox contract_info={contract_info} error_message={error_message} removeError={removeError} />
));

// Chart widgets passed into SmartCharts
export const ChartTopWidgets = () => <TopWidgets InfoBox={<InfoBoxWidget />} is_title_enabled={false} />;
export const ChartBottomWidgets = () => <BottomWidgets Digits={<DigitsWidget />} />;
