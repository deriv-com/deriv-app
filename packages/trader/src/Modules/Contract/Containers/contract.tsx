import React from 'react';
import { Redirect, withRouter } from 'react-router';
import { RouteComponentProps } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { routes } from '@deriv/shared';
import ErrorComponent from 'App/Components/Elements/Errors';
import { localize } from '@deriv/translations';
import ContractReplay from './contract-replay';
import { observer, useStore } from '@deriv/stores';

type TContractParams = { contract_id: string };
type TContract = RouteComponentProps<TContractParams>;

const dialog_errors = ['GetProposalFailure', 'ContractValidationError'];

const Contract = observer(({ match, history }: TContract) => {
    const { contract_replay } = useStore();
    const {
        removeErrorMessage,
        error_message,
        error_code,
        has_error,
        removeAccountSwitcherListener: onUnmount,
        setAccountSwitcherListener: onMount,
    } = contract_replay;
    React.useEffect(() => {
        onMount(+match.params.contract_id, history);

        return () => {
            removeErrorMessage();
            onUnmount();
        };
    }, [onMount, onUnmount, removeErrorMessage, history, match.params.contract_id]);

    if (isNaN(Number(match.params.contract_id))) {
        return <Redirect to='/404' />;
    }

    return (
        <React.Fragment>
            {has_error ? (
                <ErrorComponent
                    data-testid='dt_error_component'
                    message={error_message}
                    is_dialog={dialog_errors.includes(error_code ?? '')}
                    redirect_label={
                        dialog_errors.includes(error_code ?? '') ? localize('Ok') : localize('Go back to trading')
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
});

export default withRouter(Contract);
