import { Loading } from '@deriv/components';
import { useAuth } from '@deriv/api';
import { useObserver } from 'mobx-react';
import React, { useEffect } from 'react';

const isClassComponent = Component =>
    !!(typeof Component === 'function' && Component.prototype && Component.prototype.isReactComponent);

export const MobxContent = React.createContext(null);

function injectStorePropsToComponent(propsToSelectFn, BaseComponent) {
    const Component = own_props => {
        const store = React.useContext(MobxContent);

        let ObservedComponent = BaseComponent;

        if (isClassComponent(BaseComponent)) {
            const FunctionalWrapperComponent = props => <BaseComponent {...props} />;
            ObservedComponent = FunctionalWrapperComponent;
        }

        return useObserver(() => ObservedComponent({ ...own_props, ...propsToSelectFn(store, own_props) }));
    };

    Component.displayName = BaseComponent.name;
    return Component;
}

export const MobxContentProvider = ({ store, children }) => {
    const auth = useAuth();
    const { activeLoginId, authorizeAccounts, clientAccounts } = auth;
    useEffect(() => {
        if (activeLoginId) {
            store.client.setLoginId(activeLoginId);
        }
        if (clientAccounts) {
            store.client.setAccounts(clientAccounts);
        }
    }, [activeLoginId, authorizeAccounts, clientAccounts, store.client]);

    return clientAccounts ? <MobxContent.Provider value={store}>{children}</MobxContent.Provider> : <Loading />;
};

export const connect = propsToSelectFn => Component => injectStorePropsToComponent(propsToSelectFn, Component);
