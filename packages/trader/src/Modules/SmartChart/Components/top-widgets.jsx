import {
    AssetInformation,
    ChartTitle }      from 'smartcharts-beta';
import PropTypes      from 'prop-types';
import React          from 'react';

const TopWidgets = React.memo(({
    InfoBox,
    is_title_enabled = true,
    onSymbolChange,
}) => {
    const cachedOnSymbolChange = React.useCallback((e) => onSymbolChange(e), []);

    return (
        <React.Fragment>
            {InfoBox}
            {is_title_enabled ? <ChartTitle onChange={cachedOnSymbolChange} searchInputClassName='data-hj-whitelist' /> : ''}
            <AssetInformation />
        </React.Fragment>
    );
});

TopWidgets.displayName = 'TopWidgets';

TopWidgets.propTypes = {
    InfoBox         : PropTypes.node,
    is_title_enabled: PropTypes.bool,
    onSymbolChange  : PropTypes.func,
};

export default TopWidgets;
