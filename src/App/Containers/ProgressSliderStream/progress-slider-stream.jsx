import PropTypes             from 'prop-types';
import React                 from 'react';
import { getTimePercentage } from 'App/Components/Elements/PositionsDrawer/helpers';
import ProgressSlider        from 'App/Components/Elements/PositionsDrawer/ProgressSlider/positions-progress-slider.jsx';
import { connect }           from 'Stores/connect';

const ProgressSliderStream = ({
    id,
    is_loading,
    getPositionById,
    server_time,
}) => {
    const position = getPositionById(id);
    if (!position) {
        return <div />;
    }

    const { contract_info } = position;
    const percentage = getTimePercentage(server_time, contract_info.purchase_time, contract_info.date_expiry);

    return <ProgressSlider
        is_loading={is_loading}
        remaining_time={contract_info.date_expiry}
        percentage={percentage}
        has_result={false}
        current_tick={position.current_tick}
        ticks_count={contract_info.ticks_count}
    />;
};

ProgressSliderStream.propTypes = {
    getPositionById: PropTypes.func,
    id             : PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    is_loading     : PropTypes.bool,
    server_time    : PropTypes.object,
};

export default connect(({ modules, common }) => ({
    is_loading     : modules.portfolio.is_loading,
    server_time    : common.server_time,
    getPositionById: modules.portfolio.getPositionById,
}))(ProgressSliderStream);
