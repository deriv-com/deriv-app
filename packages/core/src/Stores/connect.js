import {
    inject,
    Provider,
    observer }   from 'mobx-react';
import PropTypes from 'prop-types';
import React     from 'react';

const SPECIAL_REACT_KEYS = { children: true, key: true, ref: true };

export class MobxProvider extends Provider {
    getChildContext() {
        const stores = {};

        // inherit stores
        const baseStores = this.context.mobxStores;
        if (baseStores) {
            for (const key in baseStores) { // eslint-disable-line
                stores[key] = baseStores[key];
            }
        }

        // add own stores
        for (const key in this.props.store) { // eslint-disable-line
            if (!SPECIAL_REACT_KEYS[key]) {
                stores[key] = this.props.store[key];
            }
        }

        return {
            mobxStores: stores,
            ...stores,
        };
    }

    static childContextTypes = {
        mobxStores: PropTypes.object,
        client    : PropTypes.object,
        common    : PropTypes.object,
        gtm       : PropTypes.object,
        segment   : PropTypes.object,
        modules   : PropTypes.object,
        ui        : PropTypes.object,
    };
}

const connect_global_store = (mapper) => Component => inject(mapper)(observer(Component));

export const connect = (StoreClass, mapper) => Component => {
    if (!mapper) {
        return connect_global_store(StoreClass)(Component);
    }

    const observed = observer(Component);

    class StoredComponent extends Component {
        store = new StoreClass();

        render() {
            return React.createElement(
                observed,
                {
                    ...this.props,
                    store: this.store,
                },
                this.props.children,
            );
        }

        propTypes = {
            children: PropTypes.object,
        }
    }

    const wrappedDisplayName = Component.displayName
        || Component.name
        || (Component.constructor && Component.constructor.name)
        || 'Unknown';
    StoredComponent.displayName = `store-${wrappedDisplayName}`;

    return inject(mapper)(StoredComponent);
};
