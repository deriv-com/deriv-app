import PropTypes from 'prop-types';
import React from 'react';
import { AssetInformation, ChartTitle } from 'Modules/SmartChart';

const TopWidgets = ({ InfoBox, is_mobile, is_title_enabled = true, onSymbolChange }) => (
    <React.Fragment>
        {InfoBox}
        <ChartTitle
            enabled={is_title_enabled}
            onChange={onSymbolChange}
            searchInputClassName='data-hj-whitelist'
            isNestedList={is_mobile}
            portalNodeId={is_mobile ? 'deriv_app' : undefined}
        />
        <AssetInformation />
    </React.Fragment>
);

TopWidgets.propTypes = {
    InfoBox: PropTypes.node,
    is_mobile: PropTypes.bool,
    is_title_enabled: PropTypes.bool,
    onSymbolChange: PropTypes.func,
};

export default TopWidgets;
