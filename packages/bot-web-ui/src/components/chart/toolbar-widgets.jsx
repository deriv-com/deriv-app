import PropTypes from 'prop-types';
import React from 'react';
import { ToolbarWidget, ChartMode, DrawTools, Share, StudyLegend, Views } from '@deriv/deriv-charts';

const ToolbarWidgets = ({ updateChartType, updateGranularity }) => (
    <ToolbarWidget>
        <ChartMode portalNodeId='modal_root' onChartType={updateChartType} onGranularity={updateGranularity} />
        <StudyLegend portalNodeId='modal_root' searchInputClassName='data-hj-whitelist' />
        <DrawTools portalNodeId='modal_root' />
        <Views portalNodeId='modal_root' searchInputClassName='data-hj-whitelist' />
        <Share portalNodeId='modal_root' />
    </ToolbarWidget>
);

ToolbarWidgets.propTypes = {
    updateChartType: PropTypes.func,
    updateGranularity: PropTypes.func,
};

export default ToolbarWidgets;
