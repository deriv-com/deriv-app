import PropTypes from 'prop-types';
import React from 'react';
import { ProgressSlider } from '@deriv/components';
import { getCurrentTick } from '@deriv/shared';
import { getCardLabels } from 'Constants/contract';
import { observer, useStore } from '@deriv/stores';

const ProgressSliderStream = observer(({ contract_info }) => {
    const { common, portfolio } = useStore();
    const { server_time } = common;
    const { is_loading } = portfolio;

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
});

ProgressSliderStream.propTypes = {
    contract_info: PropTypes.object,
};

export default ProgressSliderStream;
