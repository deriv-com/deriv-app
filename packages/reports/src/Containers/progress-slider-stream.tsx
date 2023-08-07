import React from 'react';
import { ProgressSlider } from '@deriv/components';
import { getCurrentTick, TContractInfo, getCardLabels } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';

type TProgressSliderStream = {
    contract_info: Required<TContractInfo>;
};

const ProgressSliderStream = observer(({ contract_info }: TProgressSliderStream) => {
    const { common, portfolio } = useStore();
    const { server_time } = common;
    const { is_loading } = portfolio;

    if (!contract_info) {
        return <div />;
    }
    const current_tick = contract_info.tick_count && getCurrentTick(contract_info);

    if (!server_time) return null;

    return (
        <ProgressSlider
            current_tick={current_tick}
            expiry_time={contract_info.date_expiry}
            getCardLabels={getCardLabels}
            is_loading={is_loading}
            server_time={server_time}
            start_time={contract_info.date_start}
            ticks_count={contract_info.tick_count}
        />
    );
});

export default ProgressSliderStream;
