import {
    ChartSize,
    ChartTypes,
    Comparison,
    CrosshairToggle,
    DrawTools,
    Share,
    StudyLegend,
    Timeperiod,
    Views }           from 'smartcharts-beta';
import PropTypes      from 'prop-types';
import React          from 'react';
import { Popover }    from 'App/Components/Elements/Popover';

const ControlWidgets = ({
    updateChartType,
    updateGranularity,
}) => (
    <React.Fragment>
        <CrosshairToggle />
        <ChartTypes onChange={updateChartType} />
        <StudyLegend searchInputClassName='data-hj-whitelist'
                     ItemWrapper={Popover}
                     itemWrapperProps={{ message: 'sdsddsds', alignment: 'right' }}
        />
        <Comparison searchInputClassName='data-hj-whitelist' />
        <DrawTools />
        <Views searchInputClassName='data-hj-whitelist' />
        <Share />
        <Timeperiod onChange={updateGranularity} />
        <ChartSize />
    </React.Fragment>
);

ControlWidgets.propTypes = {
    updateChartType  : PropTypes.func,
    updateGranularity: PropTypes.func,
};

export default ControlWidgets;
