import PropTypes         from 'prop-types';
import React             from 'react';
import { withRouter }    from 'react-router';
import { CSSTransition } from 'react-transition-group';
import routes            from 'Constants/routes';
import ErrorComponent    from 'App/Components/Elements/Errors';
import { Localize }      from 'deriv-translations';
import { connect }       from 'Stores/connect';
import ContractReplay    from './contract-replay.jsx';

class Contract extends React.Component {
    componentWillUnmount() {
        this.props.disableRouteMode();
        this.props.removeErrorMessage();
    }

    componentDidMount() {
        this.props.enableRouteMode();
    }

    render () {
        return (
            <React.Fragment>
                {
                    this.props.has_error ?
                        <ErrorComponent
                            message={this.props.error_message}
                            redirect_label={<Localize i18n_default_text='Go back to trading' />}
                            redirectOnClick={() => this.props.history.push(routes.trade)}
                            should_show_refresh={false}
                        />
                        :
                        <CSSTransition
                            in={!this.props.has_error}
                            timeout={400}
                            classNames={{
                                enter    : 'contract--enter',
                                enterDone: 'contract--enter-done',
                                exit     : 'contract--exit',
                            }}
                            unmountOnExit
                        >
                            <ContractReplay
                                contract_id={+this.props.match.params.contract_id}
                                key={+this.props.match.params.contract_id}
                            />
                        </CSSTransition>
                }
            </React.Fragment>
        );
    }
}

Contract.propTypes = {
    disableRouteMode  : PropTypes.func,
    enableRouteMode   : PropTypes.func,
    error_message     : PropTypes.string,
    has_error         : PropTypes.bool,
    history           : PropTypes.object,
    is_mobile         : PropTypes.bool,
    match             : PropTypes.object,
    removeErrorMessage: PropTypes.func,
    symbol            : PropTypes.string,
};

export default withRouter(connect(
    ({ modules, ui }) => ({
        disableRouteMode  : ui.disableRouteModal,
        enableRouteMode   : ui.setRouteModal,
        error_message     : modules.contract_replay.error_message,
        has_error         : modules.contract_replay.has_error,
        removeErrorMessage: modules.contract_replay.removeErrorMessage,
        symbol            : modules.contract_replay.contract_info.underlying,
        is_mobile         : ui.is_mobile,
    }),
)(Contract));
