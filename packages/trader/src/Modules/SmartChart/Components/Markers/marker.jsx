import { toJS } from 'mobx';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { FastMarker } from 'Modules/SmartChart';
import { MARKER_TYPES_CONFIG } from 'Stores/Modules/SmartChart/Constants/markers';

const ChartMarker = ({ marker_config, marker_content_props, marker_type, is_bottom_widget_visible }) => {
    const { ContentComponent, ...marker_props } = marker_config;
    const [, setState] = useState({});

    // TODO:
    //  - rename x to epoch
    //  - rename y to price
    const onRef = ref => {
        if (ref) {
            // NOTE: null price means vertical line.
            if (!marker_props.y) {
                const margin = is_bottom_widget_visible ? 115 : 0; // digit contracts have a widget at the bottom

                ref.div.style.height = `calc(100% - ${margin}px)`;
                ref.div.style.left = '-0.7px'; // To position the vertical line as center as possible.
                ref.div.style.zIndex = '-1';
            }
            marker_content_props.marker_ref = ref;
            ref.setPosition({
                epoch: +marker_props.x,
                price: +marker_props.y,
            });

            if (marker_type === MARKER_TYPES_CONFIG.SPOT_TOOLTIP.type) {
                // Just to cause a re-render with new prop
                setState({ marker_ref: ref });
            }
        }
    };

    return (
        <FastMarker markerRef={onRef}>
            <ContentComponent {...toJS(marker_content_props)} />
        </FastMarker>
    );
};

ChartMarker.propTypes = {
    marker_config: PropTypes.object,
    marker_content_props: PropTypes.object,
};

export default ChartMarker;
