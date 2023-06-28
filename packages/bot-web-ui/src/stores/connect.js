import React from 'react';
import { useObserver } from 'mobx-react';

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
    return <MobxContent.Provider value={{ ...store, ...store.core }}>{children}</MobxContent.Provider>;
};

export const connect = propsToSelectFn => Component => injectStorePropsToComponent(propsToSelectFn, Component);
