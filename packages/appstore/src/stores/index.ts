import * as React from 'react';
import { initWs } from 'Services/websocket';
import { TRootStore } from 'Types';
import RootStore from './root-store';

let stores_context: React.Context<TRootStore>;

export const initContext = (core_store: TRootStore, websocket: Record<string, unknown>): void => {
    if (!stores_context) {
        const root_store = new RootStore(core_store);
        stores_context = React.createContext<TRootStore>(root_store);

        initWs(websocket);
    }
};

export const useStores = (): TRootStore => React.useContext(stores_context);
