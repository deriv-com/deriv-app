import React from 'react';
import Loadable from 'react-loadable';
import { UILoader } from '@deriv/components';
import { localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import TraderProviders from '../../trader-providers';
import type { TCoreStores } from '@deriv/stores/types';

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

const ThemeSettingContainer = Loadable({
    loader: () =>
        import(
            /* webpackChunkName: "settings-theme", webpackPrefetch: true */ 'App/Containers/SettingsModal/settings-theme'
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
            {
                icon: 'IcTheme',
                label: localize('Theme'),
                value: props => (
                    <TraderProviders store={store}>
                        <ThemeSettingContainer {...props} />
                    </TraderProviders>
                ),
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
