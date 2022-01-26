import React from 'react';
import { ProgressSlider } from '@deriv/components';
import { getCurrentTick } from '@deriv/shared';
import { connect } from 'Stores/connect';
import { getCardLabels } from 'Constants/contract';

type ProgressSliderStreamProps = {
    contract_info: unknown;
    is_loading: boolean;
    server_time: unknown;
};

const ProgressSliderStream = ({ contract_info, is_loading, server_time }: ProgressSliderStreamProps) => {
    if (!contract_info) {
        return <div />;
    }
    const current_tick = contract_info.tick_count && getCurrentTick(contract_info);

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
};

export default connect(({ common, modules }) => ({
    is_loading: modules.portfolio.is_loading,
    server_time: common.server_time,
}))(ProgressSliderStream);
