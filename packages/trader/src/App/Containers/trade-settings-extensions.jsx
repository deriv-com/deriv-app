import PropTypes from 'prop-types';
import React from 'react';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import Lazy from 'App/Containers/Lazy';

const ChartSettingContainer = () => (
    <Lazy
        ctor={() =>
            import(
                /* webpackChunkName: "settings-chart", webpackPrefetch: true */ 'App/Containers/SettingsModal/settings-chart.jsx'
            )
        }
    />
);

// const PurchaseSettings = () => (
//     <Lazy
//         ctor={() => import(/* webpackChunkName: "settings-chart", webpackPrefetch: true */'App/Containers/SettingsModal/settings-purchase.jsx')}
//     />
// );

ChartSettingContainer.displayName = 'ChartSettingContainer';
// PurchaseSettings.displayName = 'PurchaseSettings';

class TradeSettingsExtensions extends React.Component {
    populateSettings = () => {
        const {
            populateSettingsExtensions,
            is_countdown_visible,
            is_dark_mode,
            is_layout_default,
            setCountdown,
            setChartLayout,
        } = this.props;

        const menu_items = [
            {
                icon: 'IcChart',
                label: localize('Charts'),
                value: ({ ...props }) => (
                    <ChartSettingContainer
                        is_countdown_visible={is_countdown_visible}
                        is_dark_mode={is_dark_mode}
                        is_layout_default={is_layout_default}
                        setCountdown={setCountdown}
                        setChartLayout={setChartLayout}
                        {...props}
                    />
                ),
                // uncomment below lines to bring back purchase lock and purchase confirmation}
                // }, {
                //     icon : IconPurchase,
                //     label: localize('Purchase'),
                //     value: PurchaseSettings,
            },
        ];

        populateSettingsExtensions(menu_items);
    };

    componentDidMount() {
        this.populateSettings();
    }

    componentDidUpdate() {
        this.populateSettings();
    }

    componentWillUnmount() {
        this.props.populateSettingsExtensions(null);
    }

    // eslint-disable-next-line class-methods-use-this
    render() {
        return null;
    }
}

TradeSettingsExtensions.propTypes = {
    populateSettingsExtensions: PropTypes.func,
};

export default connect(({ ui }) => ({
    populateSettingsExtensions: ui.populateSettingsExtensions,
    is_asset_visible: ui.is_chart_asset_info_visible,
    is_countdown_visible: ui.is_chart_countdown_visible,
    is_dark_mode: ui.is_dark_mode_on,
    is_layout_default: ui.is_chart_layout_default,
    setAsset: ui.setChartAssetInfo,
    setCountdown: ui.setChartCountdown,
    setChartLayout: ui.setChartLayout,
}))(TradeSettingsExtensions);
