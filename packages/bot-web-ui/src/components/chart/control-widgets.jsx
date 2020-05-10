import PropTypes from 'prop-types';
import React from 'react';
import { ChartMode, Comparison, DrawTools, Share, StudyLegend, Views } from 'smartcharts-beta';

const ControlWidgets = ({ updateChartType, updateGranularity }) => (
    <React.Fragment>
        <ChartMode onChartType={updateChartType} onGranularity={updateGranularity} />
        <StudyLegend searchInputClassName='data-hj-whitelist' />
        <Comparison searchInputClassName='data-hj-whitelist' />
        <DrawTools />
        <Views searchInputClassName='data-hj-whitelist' />
        <Share />
    </React.Fragment>
);

ControlWidgets.propTypes = {
    updateChartType: PropTypes.func,
    updateGranularity: PropTypes.func,
};

export default ControlWidgets;
