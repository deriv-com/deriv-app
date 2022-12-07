import PropTypes from 'prop-types';
import React from 'react';
import { FastMarker } from 'Modules/SmartChart';

const CurrentSpotHighlighter = ({ current_spot, current_spot_time }) => {
    const onRef = ref => {
        if (ref) {
            if (!current_spot) {
                // this call will hide the marker:
                ref.setPosition({ epoch: null, price: null });
            }
            ref.setPosition({
                epoch: +current_spot_time,
                price: +current_spot,
            });
        }
    };

    return <FastMarker markerRef={onRef} className='current-spot-highlighter' />;
};

CurrentSpotHighlighter.propTypes = {
    current_spot: PropTypes.number,
    current_spot_time: PropTypes.number,
};

export default React.memo(CurrentSpotHighlighter);
