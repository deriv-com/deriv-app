import PropTypes from 'prop-types';
import React from 'react';
import { isDesktop } from '@deriv/shared';
import { ChartMode, DrawTools, Share, StudyLegend, Views, ToolbarWidget } from 'Modules/SmartChart';

const ToolbarWidgets = ({ is_mobile, position }) => (
    <ToolbarWidget position={position || is_mobile ? 'bottom' : null}>
        <ChartMode portalNodeId='modal_root' />
        {isDesktop() && <StudyLegend portalNodeId='modal_root' searchInputClassName='data-hj-whitelist' />}
        {isDesktop() && <Views portalNodeId='modal_root' searchInputClassName='data-hj-whitelist' />}
        {isDesktop() && <DrawTools portalNodeId='modal_root' />}
        {isDesktop() && <Share portalNodeId='modal_root' />}
    </ToolbarWidget>
);

ToolbarWidgets.propTypes = {
    position: PropTypes.string,
    is_mobile: PropTypes.boolean,
};

export default React.memo(ToolbarWidgets);
