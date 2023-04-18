import React from 'react';
import { observer } from '@deriv/stores';
import { useDbotStore } from 'Stores/dbotStore';

const isClassComponent = Component =>
    !!(typeof Component === 'function' && Component.prototype && Component.prototype.isReactComponent);

function injectStorePropsToComponent(propsToSelectFn, BaseComponent) {
    const Component = own_props => {
        const store = useDbotStore();

        let ObservedComponent = BaseComponent;

        if (isClassComponent(BaseComponent)) {
            const FunctionalWrapperComponent = props => <BaseComponent {...props} />;
            ObservedComponent = FunctionalWrapperComponent;
        }

        return ObservedComponent({ ...own_props, ...propsToSelectFn(store, own_props) });
    };

    Component.displayName = BaseComponent.name;
    return observer(Component);
}

export const connect = propsToSelectFn => Component => injectStorePropsToComponent(propsToSelectFn, Component);
