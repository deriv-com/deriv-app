import PropTypes      from 'prop-types';
import React          from 'react';
import {
    ChartSize,
    ChartTypes,
    Comparison,
    CrosshairToggle,
    DrawTools,
    Share,
    StudyLegend,
    Timeperiod,
    Views }           from 'Modules/SmartChart';

const ControlWidgets = ({
    is_mobile,
    updateChartType,
    updateGranularity,
}) => (
    <React.Fragment>
        <CrosshairToggle enabled={!is_mobile} />
        <ChartTypes onChange={updateChartType} />
        {!is_mobile &&
            <>
                <StudyLegend searchInputClassName='data-hj-whitelist' />
                <Comparison searchInputClassName='data-hj-whitelist' />
                <DrawTools />
                <Views searchInputClassName='data-hj-whitelist' />
            </>
        }
        <Share />
        <Timeperiod onChange={updateGranularity} />
        <ChartSize />
    </React.Fragment>
);

ControlWidgets.propTypes = {
    is_mobile        : PropTypes.bool,
    updateChartType  : PropTypes.func,
    updateGranularity: PropTypes.func,
};

export default ControlWidgets;
