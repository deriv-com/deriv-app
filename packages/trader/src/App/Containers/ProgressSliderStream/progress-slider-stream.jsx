import PropTypes from 'prop-types';
import React from 'react';
import { ProgressSlider } from '@deriv/components';
import { getCurrentTick } from '@deriv/shared';
import { connect } from 'Stores/connect';
import { getCardLabels } from 'Constants/contract';

const ProgressSliderStream = ({ contract_info, is_loading, server_time }) => {
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

ProgressSliderStream.propTypes = {
    contract_info: PropTypes.object,
    is_loading: PropTypes.bool,
    server_time: PropTypes.object,
};

export default connect(({ common, portfolio }) => ({
    is_loading: portfolio.is_loading,
    server_time: common.server_time,
}))(ProgressSliderStream);
