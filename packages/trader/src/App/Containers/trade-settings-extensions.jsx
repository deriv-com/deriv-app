import PropTypes from 'prop-types';
import React from 'react';
import Loadable from 'react-loadable';
import { UILoader } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect, MobxContentProvider } from 'Stores/connect';

const ChartSettingContainer = Loadable({
    loader: () =>
        import(
            /* webpackChunkName: "settings-chart", webpackPrefetch: true */ 'App/Containers/SettingsModal/settings-chart.jsx'
        ),
    loading: UILoader,
});

// const PurchaseSettings = Loadable({
//     loader: () =>
//     import(/* webpackChunkName: "settings-chart", webpackPrefetch: true */'App/Containers/SettingsModal/settings-purchase.jsx'),
//     loading: UILoader,
// });

class TradeSettingsExtensions extends React.Component {
    populateSettings = () => {
        const { populateSettingsExtensions } = this.props;

        const menu_items = [
            {
                icon: 'IcChart',
                label: localize('Charts'),
                value: ({ ...props }) => (
                    <MobxContentProvider store={this.props.store}>
                        <ChartSettingContainer {...props} />
                    </MobxContentProvider>
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
}))(TradeSettingsExtensions);
