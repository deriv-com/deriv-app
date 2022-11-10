import React from 'react';
import { MobxContentProvider } from './Stores/connect';
import initStore from './Stores/init-store';
import TCoreStore from './Stores/index';
import { ProofOfAddress } from '@deriv/poa';

// TODO: add correct types for stores and WS after implementing them
type TAppProps = {
    passthrough: {
        root_store: TCoreStore;
        WS: Record<string, any>;
    };
};

const App = ({ passthrough }: TAppProps) => {
    const { root_store, WS } = passthrough;
    initStore(root_store, WS);

    return (
        <MobxContentProvider store={root_store}>
            <ProofOfAddress
                is_mx_mlt={
                    root_store.client.landing_company_shortcode === 'iom' ||
                    root_store.client.landing_company_shortcode === 'malta'
                }
                has_restricted_mt5_account={root_store.client.has_restricted_mt5_account}
            />
        </MobxContentProvider>
    );
};

export default App;
