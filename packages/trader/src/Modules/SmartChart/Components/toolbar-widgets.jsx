import PropTypes from 'prop-types';
import React from 'react';
import { isDesktop } from '@deriv/shared';
import { ChartMode, DrawTools, Share, StudyLegend, Views, ToolbarWidget } from 'Modules/SmartChart';
import { observer, useStores } from '@deriv/stores';

const ToolbarWidgets = observer(({ position }) => {
    const {
        ui: { is_mobile },
    } = useStores();
    return (
        <ToolbarWidget position={position || is_mobile ? 'bottom' : null}>
            <ChartMode portalNodeId='modal_root' />
            {isDesktop() && <StudyLegend portalNodeId='modal_root' searchInputClassName='data-hj-whitelist' />}
            {isDesktop() && <Views portalNodeId='modal_root' searchInputClassName='data-hj-whitelist' />}
            {isDesktop() && <DrawTools portalNodeId='modal_root' />}
            {isDesktop() && <Share portalNodeId='modal_root' />}
        </ToolbarWidget>
    );
});

ToolbarWidgets.propTypes = {
    position: PropTypes.string,
    updateChartType: PropTypes.func,
    updateGranularity: PropTypes.func,
};

export default React.memo(ToolbarWidgets);
