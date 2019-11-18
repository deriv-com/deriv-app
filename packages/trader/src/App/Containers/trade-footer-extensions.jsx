import PropTypes            from 'prop-types';
import React                from 'react';
import { TogglePositions }  from 'App/Components/Layout/Footer/toggle-positions.jsx';
import { connect }          from 'Stores/connect';

class TradeFooterExtensions extends React.Component {
    populateFooter = () => {
        const {
            is_logged_in,
            active_positions_count,
            show_positions_toggle,
            togglePositionsDrawer,
            is_positions_drawer_on,
            populateFooterExtensions,
        } = this.props;

        const footer_items = (is_logged_in && show_positions_toggle) &&
            (<TogglePositions
                is_positions_drawer_on={ is_positions_drawer_on }
                togglePositionsDrawer={ togglePositionsDrawer }
                positions_count={ active_positions_count }
            />);

        populateFooterExtensions(footer_items);
    };

    componentDidMount() {
        this.populateFooter();
    }

    componentDidUpdate() {
        this.populateFooter();
    }

    componentWillUnmount() {
        this.props.populateFooterExtensions(null);
    }

    // eslint-disable-next-line class-methods-use-this
    render() {
        return null;
    }
}

TradeFooterExtensions.propTypes = {
    is_logged_in            : PropTypes.bool,
    is_positions_drawer_on  : PropTypes.bool,
    populateFooterExtensions: PropTypes.func,
    show_positions_toggle   : PropTypes.bool,
    togglePositionsDrawer   : PropTypes.func,
};

export default connect(
    ({ client, modules, ui }) => ({
        is_logged_in            : client.is_logged_in,
        active_positions_count  : modules.portfolio.active_positions_count,
        show_positions_toggle   : ui.show_positions_toggle,
        togglePositionsDrawer   : ui.togglePositionsDrawer,
        is_positions_drawer_on  : ui.is_positions_drawer_on,
        populateFooterExtensions: ui.populateFooterExtensions,
    })
)(TradeFooterExtensions);
