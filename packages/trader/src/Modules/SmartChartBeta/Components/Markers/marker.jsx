import { toJS } from 'mobx';
import PropTypes from 'prop-types';
import React from 'react';
import { FastMarkerBeta } from 'Modules/SmartChartBeta';

const ChartMarkerBeta = ({ marker_config, marker_content_props }) => {
    const { ContentComponent, ...marker_props } = marker_config;

    // TODO:
    //  - rename x to epoch
    //  - rename y to price
    const onRef = ref => {
        if (ref) {
            // NOTE: null price means vertical line.
            if (!marker_props.y) {
                const margin = 24; // height of line marker icon

                ref.div.style.height = `calc(100% - ${margin}px)`;
            } else {
                ref.div.style.zIndex = '1';
            }
            ref.setPosition({
                epoch: +marker_props.x,
                price: +marker_props.y,
            });
        }
    };

    return (
        <FastMarkerBeta markerRef={onRef}>
            <ContentComponent {...toJS(marker_content_props)} />
        </FastMarkerBeta>
    );
};

ChartMarkerBeta.propTypes = {
    is_bottom_widget_visible: PropTypes.bool,
    marker_config: PropTypes.object,
    marker_content_props: PropTypes.object,
};

export default ChartMarkerBeta;
