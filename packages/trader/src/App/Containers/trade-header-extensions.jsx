import PropTypes         from 'prop-types';
import React             from 'react';
import { MobileWrapper } from '@deriv/components';
import { isMobile }      from '@deriv/shared/utils/screen';
import TogglePositions   from 'App/Components/Elements/TogglePositions';
import { connect }       from 'Stores/connect';

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
            is_logged_in,
            active_positions_count,
            show_positions_toggle,
            populateHeaderExtensions,
        } = this.props;

        const header_items = (is_logged_in && show_positions_toggle) &&
            (
                <MobileWrapper>
                    <TogglePositions
                        is_open={this.state.is_visible}
                        togglePositions={this.toggleDrawer}
                        positions_count={active_positions_count}
                    />
                </MobileWrapper>
            );

        populateHeaderExtensions(header_items);
    };

    componentDidMount() {
        if (isMobile()) this.props.onMount();
        this.populateHeader();
    }

    componentDidUpdate() {
        this.populateHeader();
    }

    componentWillUnmount() {
        if (isMobile()) this.props.onUnmount();
        this.props.populateHeaderExtensions(null);
    }

    // eslint-disable-next-line class-methods-use-this
    render() {
        return null;
    }
}

TradeHeaderExtensions.propTypes = {
    is_logged_in            : PropTypes.bool,
    populateHeaderExtensions: PropTypes.func,
    show_positions_toggle   : PropTypes.bool,
};

export default connect(
    ({ client, modules, ui }) => ({
        is_logged_in            : client.is_logged_in,
        onMount                 : modules.portfolio.onMount,
        onUnmount               : modules.portfolio.onUnmount,
        active_positions_count  : modules.portfolio.active_positions_count,
        show_positions_toggle   : ui.show_positions_toggle,
        populateHeaderExtensions: ui.populateHeaderExtensions,
    })
)(TradeHeaderExtensions);
