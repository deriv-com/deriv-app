import PropTypes             from 'prop-types';
import React                 from 'react';
import ProgressSlider        from 'App/Components/Elements/PositionsDrawer/ProgressSlider/positions-progress-slider.jsx';
import { connect }           from 'Stores/connect';

const ProgressSliderStream = ({
    id,
    is_loading,
    getPositionById,
}) => {
    const position = getPositionById(id);
    if (!position) {
        return <div />;
    }

    const { contract_info } = position;

    return <ProgressSlider
        is_loading={is_loading}
        expiry_time={contract_info.date_expiry}
        has_result={false}
        current_tick={position.current_tick}
        start_time={contract_info.date_start}
        ticks_count={contract_info.tick_count}
    />;
};

ProgressSliderStream.propTypes = {
    getPositionById: PropTypes.func,
    id             : PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    is_loading     : PropTypes.bool,
    server_time    : PropTypes.object,
};

export default connect(({ modules }) => ({
    is_loading     : modules.portfolio.is_loading,
    getPositionById: modules.portfolio.getPositionById,
}))(ProgressSliderStream);
