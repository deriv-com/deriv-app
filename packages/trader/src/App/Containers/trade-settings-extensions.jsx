import PropTypes           from 'prop-types';
import React               from 'react';
import { localize }        from 'deriv-translations';
import { connect }         from 'Stores/connect';
import Lazy                from 'App/Containers/Lazy';

const ChartSettingContainer = () => (
    <Lazy
        ctor={() => import(/* webpackChunkName: "settings-chart", webpackPrefetch: true */'App/Containers/SettingsModal/settings-chart.jsx')}
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
        const { populateSettingsExtensions } = this.props;

        const menu_items = [
            {
                icon : 'IconCharts',
                label: localize('Charts'),
                value: ChartSettingContainer,
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

export default connect(
    ({ ui }) => ({
        populateSettingsExtensions: ui.populateSettingsExtensions,
    })
)(TradeSettingsExtensions);
