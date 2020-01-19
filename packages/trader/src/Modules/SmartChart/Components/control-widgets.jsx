import PropTypes          from 'prop-types';
import React              from 'react';
import { DesktopWrapper } from '@deriv/components';
import {
    ChartSize,
    ChartTypes,
    Comparison,
    CrosshairToggle,
    DrawTools,
    Share,
    StudyLegend,
    Timeperiod,
    Views }               from 'Modules/SmartChart';

const ControlWidgets = ({
    updateChartType,
    updateGranularity,
}) => (
    <React.Fragment>
        <DesktopWrapper>
            <CrosshairToggle enabled />
        </DesktopWrapper>
        <ChartTypes onChange={updateChartType} />
        <DesktopWrapper>
            <StudyLegend searchInputClassName='data-hj-whitelist' />
            <Comparison searchInputClassName='data-hj-whitelist' />
            <DrawTools />
            <Views searchInputClassName='data-hj-whitelist' />
        </DesktopWrapper>
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
