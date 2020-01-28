import { inject }           from 'mobx-react';
import React, { Component } from 'react';

function connectMainStore(mapperFunction) {
    // Combine both stores and props, with props taking precedence
    const mapStoresAndProps = (root_store, props /* , context */) => ({
        ...mapperFunction(root_store),
        ...props,
    });

    return WrappedComponent => inject(mapStoresAndProps)(WrappedComponent);
}

function connectCustomStore(mapperFunction, CustomStore) {
    return (WrappedComponent) => {
        class StoredComponent extends Component {
            constructor(props) {
                super(props);
                const { root_store } = this.props;
                this.store = new CustomStore(root_store);
                const mapStoresAndProps = (_rootStore, nextProps) => ({
                    ...mapperFunction(this.store),
                    ...nextProps,
                });
                if (this.store.updateProps) {
                    this.store.updateProps(props);
                }
                this.injectedComponent = inject(mapStoresAndProps)(WrappedComponent);
            }

            getDerivedStateFromProps(nextProps) {
                if (this.store.updateProps) {
                    this.store.updateProps(nextProps);
                }
            }

            componentWillUnmount() {
                if (this.store.destructor) {
                    this.store.destructor();
                }
            }

            render() {
                return React.createElement(this.injectedComponent);
            }
        }

        // make some nice names that will show up in the React Devtools
        const wrappedDisplayName = WrappedComponent.displayName
            || WrappedComponent.name
            || (WrappedComponent.constructor && WrappedComponent.constructor.name)
            || 'Unknown';
        StoredComponent.displayName = `unbox-${wrappedDisplayName}`;

        return inject(root_store => ({ root_store }))(StoredComponent);
    };
}

// if store is not defined, root store is used
export function connect(mapperFunction, CustomStore) {
    if (CustomStore === undefined) {
        return connectMainStore(mapperFunction);
    }

    return connectCustomStore(mapperFunction, CustomStore);
}
