import { toJS } from 'mobx';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'Stores/connect';

class Test extends React.Component {
    state = { is_visible: false, store: 'trade' };
    setVisibility = this.stateVisibility.bind(this);
    styles = {
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

    componentDidMount = () => {
        document.addEventListener('keyup', this.setVisibility, false);
    };

    componentWillUnmount = () => {
        document.removeEventListener('keyup', this.setVisibility);
    };

    stateVisibility(e) {
        // Ctrl + s
        if (e.ctrlKey && e.keyCode === 83) this.setState({ is_visible: !this.state.is_visible });
    }

    renderStoreContent = ([k, v]) => {
        return (
            k !== 'root_store' &&
            typeof v !== 'function' && (
                <div key={k}>
                    <span style={this.styles.prop_name}>{k}:</span>{' '}
                    {v && typeof v === 'object' ? JSON.stringify(toJS(v), null, 1) : v}
                </div>
            )
        );
    };

    render() {
        const { container, tab, tabs } = this.styles;
        const { is_visible, store: selected_store } = this.state;

        return (
            <code id='state_info' style={{ ...container, display: is_visible ? 'block' : 'none' }}>
                <div style={tabs}>
                    {Object.keys(this.props).map(store => (
                        <p
                            key={store}
                            onClick={() => this.setState({ store })}
                            style={{ ...tab, fontWeight: store === selected_store && 'bold' }}
                        >
                            {store}
                        </p>
                    ))}
                </div>
                {this.props[this.state.store].sort().map(this.renderStoreContent)}
            </code>
        );
    }
}

Test.propTypes = {
    entries: PropTypes.array,
};

export default connect(({ modules, client, ui }) => ({
    trade: Object.entries(modules.trade),
    client: Object.entries(client),
    ui: Object.entries(ui),
    portfolio: Object.entries(modules.portfolio),
}))(Test);
