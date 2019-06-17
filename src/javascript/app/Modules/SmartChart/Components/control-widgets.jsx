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
import { localize }   from '_common/localize';
import { Popover }    from 'App/Components/Elements/Popover';

const ControlWidgets = ({
    hasReachedLimitListener,
    is_study_limit_error_visible,
    updateChartType,
    updateGranularity,
}) => (
    <React.Fragment>
        <CrosshairToggle />
        <ChartTypes onChange={updateChartType} />
        <StudyLegend searchInputClassName='data-hj-whitelist'
                     ItemWrapper={Popover}
                     itemWrapperProps={{
                         message: localize('You can\'t have more than 5 open Indicators.'),
                         alignment: 'right',
                         classNameTarget: 'popover__study',
                         is_hidden: !is_study_limit_error_visible,
                     }}
                     hasReachedLimitListener={hasReachedLimitListener}
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
    hasReachedLimitListener     : PropTypes.func,
    is_study_limit_error_visible: PropTypes.bool,
    updateChartType             : PropTypes.func,
    updateGranularity           : PropTypes.func,
};

export default ControlWidgets;
