import { toJS } from 'mobx';
import PropTypes from 'prop-types';
import React from 'react';
import { useTraderStore } from 'Stores/useTraderStores';
import { observer, useStore } from '@deriv/stores';

const styles = {
    container: {
        fontSize: '10px',
        lineHeight: '15px',
        position: 'absolute',
        zIndex: 1,
        background: 'rgba(0, 0, 0, 0.8)',
        color: '#ccc',
        padding: '10px',
        marginTop: '-10px',
        display: 'none',
        overflowY: 'auto',
        height: '100%',
        width: '100%',
    },
    prop_name: {
        color: 'yellowgreen',
    },
    tabs: { display: 'flex', textAlign: 'center', marginBottom: '10px' },
    tab: {
        fontSize: '18px',
        border: '1px solid grey',
        width: '100%',
        padding: '10px',
    },
};

const Test = observer(() => {
    const stores = useStore();
    const trade_store = useTraderStore();
    const test_stores = {
        trade: Object.entries(trade_store),
        client: Object.entries(stores.client),
        ui: Object.entries(stores.ui),
        portfolio: Object.entries(stores.portfolio),
    };

    const [is_visible, setIsVisible] = React.useState(false);
    const [store, setStore] = React.useState('trade');

    React.useEffect(() => {
        document.addEventListener('keyup', stateVisibility, false);
        return () => {
            document.removeEventListener('keyup', stateVisibility);
        };
    });

    const stateVisibility = e => {
        // Ctrl + s
        if (e.ctrlKey && e.keyCode === 83) setIsVisible(!is_visible);
    };

    const renderStoreContent = ([k, v]) => {
        return (
            k !== 'root_store' &&
            typeof v !== 'function' && (
                <div key={k}>
                    <span style={styles.prop_name}>{k}:</span>{' '}
                    {v && typeof v === 'object' ? JSON.stringify(toJS(v), null, 1) : v}
                </div>
            )
        );
    };

    const { container, tab, tabs } = styles;

    return (
        <code id='state_info' style={{ ...container, display: is_visible ? 'block' : 'none' }}>
            <div style={tabs}>
                {Object.keys(test_stores).map(storage => (
                    <p
                        key={storage}
                        onClick={() => setStore(storage)}
                        style={{ ...tab, fontWeight: storage === store && 'bold' }}
                    >
                        {storage}
                    </p>
                ))}
            </div>
            {test_stores[store].sort().map(renderStoreContent)}
        </code>
    );
});

Test.propTypes = {
    entries: PropTypes.array,
};

export default Test;
