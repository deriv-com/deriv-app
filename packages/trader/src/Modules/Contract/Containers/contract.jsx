import PropTypes from 'prop-types';
import React from 'react';
import { Redirect, withRouter } from 'react-router';
import { CSSTransition } from 'react-transition-group';
import { routes } from '@deriv/shared';
import ErrorComponent from 'App/Components/Elements/Errors';
import { Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import ContractReplay from './contract-replay.jsx';

class Contract extends React.Component {
    componentDidMount() {
        this.props.onMount(+this.props.match.params.contract_id, this.props.history);
    }

    componentWillUnmount() {
        this.props.removeErrorMessage();
        this.props.onUnmount();
    }

    render() {
        if (isNaN(this.props.match.params.contract_id)) {
            return <Redirect to='/404' />;
        }

        return (
            <React.Fragment>
                {this.props.has_error ? (
                    <ErrorComponent
                        message={this.props.error_message}
                        redirect_label={<Localize i18n_default_text='Go back to trading' />}
                        redirectOnClick={() => this.props.history.push(routes.trade)}
                        should_show_refresh={false}
                    />
                ) : (
                    <CSSTransition
                        in={!this.props.has_error}
                        timeout={400}
                        classNames={{
                            enter: 'contract--enter',
                            enterDone: 'contract--enter-done',
                            exit: 'contract--exit',
                        }}
                        unmountOnExit
                    >
                        <ContractReplay
                            contract_id={+this.props.match.params.contract_id}
                            key={+this.props.match.params.contract_id}
                        />
                    </CSSTransition>
                )}
            </React.Fragment>
        );
    }
}

Contract.propTypes = {
    error_message: PropTypes.string,
    has_error: PropTypes.bool,
    history: PropTypes.object,
    is_mobile: PropTypes.bool,
    match: PropTypes.object,
    onMount: PropTypes.func,
    onUnmount: PropTypes.func,
    removeErrorMessage: PropTypes.func,
    symbol: PropTypes.string,
};

export default withRouter(
    connect(({ modules, ui }) => ({
        error_message: modules.contract_replay.error_message,
        has_error: modules.contract_replay.has_error,
        onMount: modules.contract_replay.setAccountSwitcherListener,
        onUnmount: modules.contract_replay.removeAccountSwitcherListener,
        removeErrorMessage: modules.contract_replay.removeErrorMessage,
        symbol: modules.contract_replay.contract_info.underlying,
        is_mobile: ui.is_mobile,
    }))(Contract)
);
