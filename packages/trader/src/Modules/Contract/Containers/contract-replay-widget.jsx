import React from 'react';
import Digits from 'Modules/Contract/Components/Digits';
import InfoBox from 'Modules/Contract/Components/InfoBox';
import BottomWidgets from '../../SmartChart/Components/bottom-widgets.jsx';
import TopWidgets from '../../SmartChart/Components/top-widgets.jsx';
import BottomWidgetsAlpha from '../../SmartChartAlpha/Components/bottom-widgets.jsx';
import TopWidgetsAlpha from '../../SmartChartAlpha/Components/top-widgets.jsx';
import { observer, useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';

export const DigitsWidget = observer(() => {
    const { contract_replay } = useStore();
    const { contract_store } = contract_replay;
    const { contract_info, digits_info, display_status, is_digit_contract, is_ended } = contract_store;

    return (
        <Digits
            is_digit_contract={is_digit_contract}
            is_ended={is_ended}
            contract_info={contract_info}
            digits_info={digits_info}
            display_status={display_status}
        />
    );
});

export const InfoBoxWidget = observer(() => {
    const { contract_replay } = useStore();
    const { is_vanilla } = useTraderStore();
    const { contract_store, removeErrorMessage: removeError, error_message } = contract_replay;
    const { contract_info } = contract_store;

    return (
        <InfoBox
            contract_info={contract_info}
            error_message={error_message}
            removeError={removeError}
            is_vanilla={is_vanilla}
        />
    );
});

// Chart widgets passed into SmartCharts
export const ChartTopWidgets = observer(() => {
    const { client } = useStore();
    const { is_alpha_chart } = client;
    return (
        <>
            {is_alpha_chart && <TopWidgetsAlpha InfoBox={<InfoBoxWidget />} is_title_enabled={false} />}
            {!is_alpha_chart && <TopWidgets InfoBox={<InfoBoxWidget />} is_title_enabled={false} />}
        </>
    );
});

export const ChartBottomWidgets = observer(() => {
    const { client } = useStore();
    const { is_alpha_chart } = client;
    return (
        <>
            {is_alpha_chart && <BottomWidgetsAlpha Digits={<DigitsWidget />} />}
            {!is_alpha_chart && <BottomWidgets Digits={<DigitsWidget />} />}
        </>
    );
});
