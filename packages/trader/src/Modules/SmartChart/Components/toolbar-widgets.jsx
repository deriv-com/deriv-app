import PropTypes from 'prop-types';
import React from 'react';
import { isMobile } from '@deriv/shared/utils/screen';
import { ChartMode, ToolbarWidget } from 'Modules/SmartChart';

const ToolbarWidgets = ({ position, updateChartType, updateGranularity }) => (
    <ToolbarWidget position={position || isMobile() ? 'bottom' : null}>
        <ChartMode portalNodeId='modal_root' onChartType={updateChartType} onGranularity={updateGranularity} />
    </ToolbarWidget>
);

ToolbarWidgets.propTypes = {
    position: PropTypes.string,
    updateChartType: PropTypes.func,
    updateGranularity: PropTypes.func,
};

export default ToolbarWidgets;
