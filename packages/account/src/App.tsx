import React from 'react';
import { MobxContentProvider } from './Stores/connect';
import initStore from './Stores/init-store';
import TCoreStore from './Stores/index';
import { ProofOfAddress, ProofOfIdentity } from '@deriv/poa';

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
            <div
                style={{
                    flex: 1,
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    flexDirection: 'row',
                    display: 'flex',
                    height: '90vh',
                }}
            >
                <ProofOfAddress />
                <ProofOfIdentity />
            </div>
        </MobxContentProvider>
    );
};

export default App;
