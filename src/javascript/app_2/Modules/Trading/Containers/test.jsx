import { toJS }    from 'mobx';
import PropTypes   from 'prop-types';
import React       from 'react';
import { connect } from 'Stores/connect';

class Test extends React.Component {
    state         = { is_visible: false };
    setVisibility = this.stateVisibility.bind(this);
    styles        = {
        container: {
            fontSize  : '10px',
            lineHeight: '15px',
            position  : 'absolute',
            zIndex    : 1,
            background: 'rgba(0, 0, 0, 0.8)',
            color     : '#ccc',
            padding   : '10px',
            marginTop : '-10px',
            display   : 'none',
            overflowY : 'auto',
            height    : '100%',
        },
        prop_name: {
            color: 'yellowgreen',
        },
    };

    componentDidMount = () => {
        document.addEventListener('keyup', this.setVisibility, false);
    };

    componentWillUnmount = () => {
        document.removeEventListener('keyup', this.setVisibility);
    };

    stateVisibility(e) {
        if (e.ctrlKey && e.keyCode === 83) { // Ctrl + S
            this.setState({ is_visible: !this.state.is_visible });
        }
    }

    render() {
        return (
            <code id='state_info' style={Object.assign({}, this.styles.container, { display: this.state.is_visible ? 'block' : 'none' })}>
                {this.props.entries.sort().map(([k, v]) => k !== 'root_store' && typeof v !== 'function' && <div key={k}><span style={this.styles.prop_name}>{k}:</span> {v && typeof v === 'object' ? JSON.stringify(toJS(v), null, 1) : v}</div>)}
            </code>
        );
    }
}

Test.propTypes = {
    entries: PropTypes.array,
};

export default connect(
    ({ modules }) => ({
        entries: Object.entries(modules.trade),
    })
)(Test);
