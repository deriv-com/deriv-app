import React from 'react';
import PropTypes from 'prop-types';
import { ChartMode, DrawTools, Share, StudyLegend, ToolbarWidget, Views } from '@deriv/deriv-charts';

// eslint-disable-next-line react/prop-types
const ToolbarWidgets = ({ handleStateChange }) => (
    <ToolbarWidget>
        <ChartMode
            onChartType={chart_type =>
                handleStateChange({
                    chart_type,
                })
            }
            onGranularity={granularity =>
                handleStateChange({
                    granularity,
                })
            }
        />
        <StudyLegend searchInputClassName='data-hj-whitelist' />
        <DrawTools />
        <Views searchInputClassName='data-hj-whitelist' />
        <Share />
    </ToolbarWidget>
);

ToolbarWidgets.propTypes = {
    handleStateChange: PropTypes.func,
};

export default ToolbarWidgets;
