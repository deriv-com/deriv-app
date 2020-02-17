import PropTypes from 'prop-types';
import React from 'react';
import { ChartMode, Comparison, DrawTools, Share, StudyLegend, Timeperiod, Views } from 'Modules/SmartChart';

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
    </React.Fragment>
);

ControlWidgets.propTypes = {
    updateChartType: PropTypes.func,
    updateGranularity: PropTypes.func,
};

export default ControlWidgets;
