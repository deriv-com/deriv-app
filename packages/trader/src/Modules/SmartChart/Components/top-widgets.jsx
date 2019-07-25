import {
    AssetInformation,
    ChartTitle }            from 'smartcharts-beta';
import PropTypes            from 'prop-types';
import React, { Component } from 'react';

class TopWidgets extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.is_title_enabled !== this.props.is_title_enabled;
    }

    render() {
        const {
            InfoBox,
            is_title_enabled,
            onSymbolChange,
        } = this.props;
        return (
            <React.Fragment>
                {InfoBox}
                <ChartTitle
                    enabled={is_title_enabled}
                    onChange={onSymbolChange}
                    searchInputClassName='data-hj-whitelist'
                />
                <AssetInformation />
            </React.Fragment>
        );
    }
}

TopWidgets.defaultProps = { is_title_enabled: true };

TopWidgets.propTypes = {
    InfoBox         : PropTypes.node,
    is_title_enabled: PropTypes.bool,
    onSymbolChange  : PropTypes.func,
};

export default TopWidgets;
