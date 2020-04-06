import { useObserver } from 'mobx-react';
import React from 'react';

function isClassComponent(Component) {
    return !!(typeof Component === 'function' && Component.prototype && Component.prototype.isReactComponent);
}

export const MobxContent = React.createContext(null);

function injectCustom(selector, BaseComponent) {
    const component = ownProps => {
        const store = React.useContext(MobxContent);
        const storeProps = selector(store);

        if (!isClassComponent(BaseComponent)) {
            return useObserver(() => BaseComponent({ ...ownProps, ...selector(store, ownProps) }));
        }

        const NewComponent = props => <BaseComponent {...props} />;
        return useObserver(() => NewComponent({ ...ownProps, ...selector(store, ownProps) }));
    };

    component.displayName = BaseComponent.name;
    return component;
}

export const MobxContentProvider = ({ store, children }) => {
    return <MobxContent.Provider value={{ ...store, mobxStores: store }}>{children}</MobxContent.Provider>;
};

export const connect = (StoreClass, mapper) => Component => {
    return injectCustom(StoreClass, Component);
};
