import classNames from 'classnames';
import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { useDeepEffect } from '@deriv/components';
import Routes from 'Components/routes/routes';
import { useStores } from 'Stores';
import { TUIProps, TClientProps, TConfigProps } from 'Types';
import './app.scss';

const App: React.FC<TAppProps> = ({ className, client, config, ui, ws }) => {
    const { client_store, config_store, ui_store } = useStores(ws);

    // Different consumers of this package have different sized headers and footers so they
    // need to be offset in order to fill the entire page.
    const dashboard_height = ui.height_offset ? `calc(100vh - ${ui.height_offset})` : '100vh';

    useDeepEffect(() => {
        ui_store.init(ui);
        client_store.init(client);
        config_store.setConfig(config);
    }, [client, ui]);

    return (
        <main
            style={{ height: dashboard_height }}
            className={classNames('dashboard', className, {
                'theme--light': !ui_store.is_dark_mode_on,
                'theme--dark': ui_store.is_dark_mode_on,
            })}
        >
            <div className='dw-dashboard'>
                <Routes />
            </div>
        </main>
    );
};

type TAppProps = {
    className: string;
    client: TClientProps;
    config: TConfigProps;
    ui: TUIProps;
    ws: unknown;
};

export default observer(App);
