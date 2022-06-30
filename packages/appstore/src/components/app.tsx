import classNames from 'classnames';
import * as React from 'react';
import { observer } from 'mobx-react-lite';
import Routes from 'Components/routes/routes';
import { useStores, initContext } from 'Stores';
import './app.scss';
import { CoreStoreTypes } from 'Stores/root-store';

type TAppProps = {
    passthrough: {
        root_store: CoreStoreTypes;
        WS: Record<string, any>;
    };
};

const App: React.FC<TAppProps> = ({ passthrough }: TAppProps) => {
    const { root_store, WS } = passthrough;
    initContext(root_store, WS);

    const { ui } = useStores();

    // Different consumers of this package have different sized headers and footers so they
    // need to be offset in order to fill the entire page.
    const dashboard_height = ui.height_offset ? `calc(100vh - ${ui.height_offset})` : '100vh';

    return (
        <main
            style={{ height: dashboard_height }}
            className={classNames('dashboard', {
                'theme--light': !ui.is_dark_mode_on,
                'theme--dark': ui.is_dark_mode_on,
            })}
        >
            <div className='dw-dashboard'>
                <Routes />
            </div>
        </main>
    );
};

export default observer(App);
