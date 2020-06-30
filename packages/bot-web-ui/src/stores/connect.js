import { useObserver } from 'mobx-react';
import React from 'react';

const isClassComponent = (Component) =>
    !!(typeof Component === 'function' && Component.prototype && Component.prototype.isReactComponent);

export const MobxContent = React.createContext(null);

function injectStorePropsToComponent(propsToSelectFn, BaseComponent) {
    const component = (own_props) => {
        const store = React.useContext(MobxContent);

        if (!isClassComponent(BaseComponent)) {
            return useObserver(() => BaseComponent({ ...own_props, ...propsToSelectFn(store, own_props) }));
        }

        const FunctionalWrapperComponent = (props) => <BaseComponent {...props} />;
        return useObserver(() => FunctionalWrapperComponent({ ...own_props, ...propsToSelectFn(store, own_props) }));
    };

    component.displayName = BaseComponent.name;
    return component;
}

export const MobxContentProvider = ({ store, children }) => {
    return <MobxContent.Provider value={{ ...store, ...store.core }}>{children}</MobxContent.Provider>;
};

export const connect = (propsToSelectFn) => (Component) => injectStorePropsToComponent(propsToSelectFn, Component);
