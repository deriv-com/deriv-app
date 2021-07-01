import PropTypes from 'prop-types';
import React from 'react';
import { Redirect, withRouter } from 'react-router';
import { CSSTransition } from 'react-transition-group';
import { routes } from '@deriv/shared';
import ErrorComponent from 'App/Components/Elements/Errors';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import ContractReplay from './contract-replay.jsx';

const dialog_errors = ['GetProposalFailure', 'ContractValidationError'];

const Contract = ({ error_code, error_message, match, history, has_error, onMount, onUnmount, removeErrorMessage }) => {
    React.useEffect(() => {
        onMount(+match.params.contract_id, history);

        return () => {
            removeErrorMessage();
            onUnmount();
        };
    }, [onMount, onUnmount, removeErrorMessage]);

    if (isNaN(match.params.contract_id)) {
        return <Redirect to='/404' />;
    }

    return (
        <React.Fragment>
            {has_error ? (
                <ErrorComponent
                    message={error_message}
                    is_dialog={dialog_errors.includes(error_code)}
                    redirect_label={
                        dialog_errors.includes(error_code) ? localize('Ok') : localize('Go back to trading')
                    }
                    redirectOnClick={() => history.push(routes.trade)}
                    should_show_refresh={false}
                />
            ) : (
                <CSSTransition
                    in={!has_error}
                    timeout={400}
                    classNames={{
                        enter: 'contract--enter',
                        enterDone: 'contract--enter-done',
                        exit: 'contract--exit',
                    }}
                    unmountOnExit
                >
                    <ContractReplay contract_id={+match.params.contract_id} key={+match.params.contract_id} />
                </CSSTransition>
            )}
        </React.Fragment>
    );
};

Contract.propTypes = {
    error_message: PropTypes.string,
    error_code: PropTypes.string,
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
        error_code: modules.contract_replay.error_code,
        has_error: modules.contract_replay.has_error,
        onMount: modules.contract_replay.setAccountSwitcherListener,
        onUnmount: modules.contract_replay.removeAccountSwitcherListener,
        removeErrorMessage: modules.contract_replay.removeErrorMessage,
        symbol: modules.contract_replay.contract_info.underlying,
        is_mobile: ui.is_mobile,
    }))(Contract)
);
