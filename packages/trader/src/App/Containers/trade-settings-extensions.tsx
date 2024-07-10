import React from 'react';
import Loadable from 'react-loadable';
import { UILoader } from '@deriv-app/components';
import { localize } from '@deriv-app/translations';
import { observer, useStore } from '@deriv-app/stores';
import TraderProviders from '../../trader-providers';
import type { TCoreStores } from '@deriv-app/stores/types';

type TTradeSettingsExtensionsProps = {
    store: TCoreStores;
};

const ChartSettingContainer = Loadable({
    loader: () =>
        import(
            /* webpackChunkName: "settings-chart", webpackPrefetch: true */ 'App/Containers/SettingsModal/settings-chart'
        ),
    loading: () => <UILoader />,
});

const renderItemValue = <T extends object>(props: T, store: TCoreStores) => (
    <TraderProviders store={store}>
        <ChartSettingContainer {...props} />
    </TraderProviders>
);

const TradeSettingsExtensions = observer(({ store }: TTradeSettingsExtensionsProps) => {
    const { ui } = useStore();
    const { populateSettingsExtensions } = ui;
    const populateSettings = () => {
        const menu_items: Parameters<typeof populateSettingsExtensions>[0] = [
            {
                icon: 'IcChart',
                label: localize('Charts'),
                value: props => renderItemValue(props, store),
            },
        ];
        populateSettingsExtensions(menu_items);
    };

    React.useEffect(() => {
        return () => populateSettingsExtensions(null);
    }, [populateSettingsExtensions]);

    React.useEffect(() => populateSettings());

    return null;
});

export default TradeSettingsExtensions;
