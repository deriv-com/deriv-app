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

const renderItemValue = (props, store) => (
    <MobxContentProvider store={store}>
        <ChartSettingContainer {...props} />
    </MobxContentProvider>
);

const TradeSettingsExtensions = ({ populateSettingsExtensions, store }) => {
    const populateSettings = () => {
        const menu_items = [
            {
                icon: 'IcChart',
                label: localize('Charts'),
                value: props => renderItemValue(props, store),
                // uncomment below lines to bring back purchase lock and purchase confirmation}
                // }, {
                //     icon : IconPurchase,
                //     label: localize('Purchase'),
                //     value: PurchaseSettings,
            },
        ];

        populateSettingsExtensions(menu_items);
    };

    React.useEffect(() => {
        return () => populateSettingsExtensions(null);
    }, []);

    React.useEffect(() => populateSettings());

    return null;
};

TradeSettingsExtensions.propTypes = {
    populateSettingsExtensions: PropTypes.func,
    store: PropTypes.object,
};

export default connect(({ ui }) => ({
    populateSettingsExtensions: ui.populateSettingsExtensions,
}))(TradeSettingsExtensions);
