import PropTypes       from 'prop-types';
import React           from 'react';
import TogglePositions from 'App/Components/Elements/TogglePositions';
import { connect }     from 'Stores/connect';

class TradeHeaderExtensions extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            is_visible: false,
        };
    }

    toggleDrawer = () => {
        this.setState({ is_visible: !this.state.is_visible });
    };

    populateHeader = () => {
        const {
            is_mobile,
            is_logged_in,
            active_positions_count,
            show_positions_toggle,
            populateHeaderExtensions,
        } = this.props;

        const header_items = (is_logged_in && show_positions_toggle) &&
            (
                <TogglePositions
                    is_mobile={is_mobile}
                    is_open={this.state.is_visible}
                    togglePositions={this.toggleDrawer}
                    positions_count={active_positions_count}
                />
            );

        populateHeaderExtensions(header_items);
    };

    componentDidMount() {
        this.props.onMount();
        this.populateHeader();
    }

    componentDidUpdate() {
        this.populateHeader();
    }

    componentWillUnmount() {
        this.props.onUnmount();
        this.props.populateHeaderExtensions(null);
    }

    // eslint-disable-next-line class-methods-use-this
    render() {
        return null;
    }
}

TradeHeaderExtensions.propTypes = {
    is_logged_in            : PropTypes.bool,
    is_mobile               : PropTypes.bool,
    populateHeaderExtensions: PropTypes.func,
    show_positions_toggle   : PropTypes.bool,
};

export default connect(
    ({ client, modules, ui }) => ({
        is_logged_in            : client.is_logged_in,
        onMount                 : modules.portfolio.onMount,
        onUnmount               : modules.portfolio.onUnmount,
        active_positions_count  : modules.portfolio.active_positions_count,
        is_mobile               : ui.is_mobile,
        show_positions_toggle   : ui.show_positions_toggle,
        populateHeaderExtensions: ui.populateHeaderExtensions,
    })
)(TradeHeaderExtensions);
