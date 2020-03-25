import PropTypes from 'prop-types';
import React from 'react';
import ProgressSlider from 'App/Components/Elements/PositionsDrawer/ProgressSlider/positions-progress-slider.jsx';
import { connect } from 'Stores/connect';
import { getCurrentTick } from 'Stores/Modules/Portfolio/Helpers/details';

const ProgressSliderStream = ({ contract_info, is_loading }) => {
    if (!contract_info) {
        return <div />;
    }
    const current_tick = contract_info.tick_count && getCurrentTick(contract_info);

    return (
        <ProgressSlider
            is_loading={is_loading}
            expiry_time={contract_info.date_expiry}
            has_result={false}
            current_tick={current_tick}
            start_time={contract_info.date_start}
            ticks_count={contract_info.tick_count}
        />
    );
};

ProgressSliderStream.propTypes = {
    contract_info: PropTypes.object,
    is_loading: PropTypes.bool,
};

export default connect(({ modules }) => ({
    is_loading: modules.portfolio.is_loading,
}))(ProgressSliderStream);
