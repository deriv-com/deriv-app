import React from 'react';
import { ChartMode, DrawTools, Share, StudyLegend, ToolbarWidget, Views } from '@deriv/deriv-charts';

// eslint-disable-next-line react/prop-types
const ToolbarWidgets = ({ setState }) => (
    <ToolbarWidget>
        <ChartMode
            onChartType={chart_type =>
                setState({
                    chart_type,
                })
            }
            onGranularity={granularity =>
                setState({
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

export default ToolbarWidgets;
