import PropTypes       from 'prop-types';
import React           from 'react';
import { withRouter }  from 'react-router';
import { Link }        from 'react-router-dom';
import { localize }    from '_common/localize';
import UILoader        from 'App/Components/Elements/ui-loader.jsx';
import routes          from 'Constants/routes';
import { connect }     from 'Stores/connect';
import DetailsContents from '../Components/Details/details-contents.jsx';
import DetailsHeader   from '../Components/Details/details-header.jsx';
import ErrorComponent  from '../../../App/Components/Elements/Errors';

class ContractDetails extends React.Component {
    componentDidMount() { this.props.onMount(this.props.contract_id); }

    componentWillUnmount() { this.props.onUnmount(); }

    render() {
        const {
            contract_id,
            longcode,
            transaction_ids,
        } = this.props.contract_info;

        if (contract_id && !this.props.has_error) {
            return (
                <React.Fragment>
                    <div className='contract-container'>
                        <DetailsHeader status={this.props.display_status} />
                        <DetailsContents
                            buy_id={transaction_ids.buy}
                            details_expiry={this.props.details_expiry}
                            details_info={this.props.details_info}
                            longcode={longcode}
                        />
                        <Link
                            className='btn btn--link btn--secondary btn--secondary--orange'
                            to={routes.trade}
                            onClick={this.props.onClickNewTrade}
                        >
                            <span className='btn__text'>{localize('Start a new trade')}</span>
                        </Link>
                    </div>
                </React.Fragment>
            );
        } else if (!contract_id && !this.props.has_error) {
            return (
                <UILoader />
            );
        }
        return (
            <ErrorComponent
                message={this.props.error_message}
                redirect_label={localize('Go back to trading')}
                redirectOnClick={() => this.props.history.push(routes.trade)}
                should_show_refresh={false}
            />
        );

    }
}

ContractDetails.propTypes = {
    contract_id    : PropTypes.number,
    contract_info  : PropTypes.object,
    details_expiry : PropTypes.object,
    details_info   : PropTypes.object,
    display_status : PropTypes.string,
    error_message  : PropTypes.string,
    has_error      : PropTypes.bool,
    history        : PropTypes.object,
    onClickNewTrade: PropTypes.func,
    onMount        : PropTypes.func,
    onUnmount      : PropTypes.func,
};

export default withRouter(connect(
    ({ modules }) => ({
        contract_info : modules.contract.contract_info,
        details_info  : modules.contract.details_info,
        details_expiry: modules.contract.details_expiry,
        display_status: modules.contract.display_status,
        error_message : modules.contract.error_message,
        has_error     : modules.contract.has_error,
        onMount       : modules.contract.onMount,
        onUnmount     : modules.contract.onUnmount,
    }),
)(ContractDetails));
