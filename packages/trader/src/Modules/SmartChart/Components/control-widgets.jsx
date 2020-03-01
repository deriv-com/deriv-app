import PropTypes from 'prop-types';
import React from 'react';
import { ChartSize, ChartMode, Comparison, DrawTools, Share, StudyLegend, Views } from 'Modules/SmartChart';

const ControlWidgets = ({ updateChartType, updateGranularity }) => (
    <React.Fragment>
        <ChartMode
            portalNodeId='modal_root'
            onChartType={type => updateChartType(type)}
            onGranularity={granularity => updateGranularity(granularity)}
        />
        <StudyLegend searchInputClassName='data-hj-whitelist' />
        <Comparison searchInputClassName='data-hj-whitelist' />
        <DrawTools />
        <Views searchInputClassName='data-hj-whitelist' />
        <Share portalNodeId='modal_root' />
        <ChartSize />
    </React.Fragment>
);

ControlWidgets.propTypes = {
    updateChartType: PropTypes.func,
    updateGranularity: PropTypes.func,
};

export default ControlWidgets;
