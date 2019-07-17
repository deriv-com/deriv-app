import PropTypes   from 'prop-types';
import React       from 'react';
import { connect } from 'Stores/connect';
import Loading     from '../../../templates/_common/components/loading.jsx';

class Deposit extends React.Component {
    componentDidMount() {
        this.props.onMount();
    }

    render() {
        return (
            <React.Fragment>
                {this.props.is_loading && <Loading />}
                {this.props.deposit_url &&
                <iframe
                    className='deposit__content'
                    height={this.props.container_height}
                    src={this.props.deposit_url}
                    frameBorder='0'
                    scrolling='auto'
                />
                }
                {this.props.error_message && <p>{this.props.error_message}</p>}
                {/* TODO: uncomment this if cross origin issue is fixed */}
                {/* <div */}
                {/*     className='deposit__content' */}
                {/*     dangerouslySetInnerHTML={{ __html: this.props.deposit_url }} */}
                {/* /> */}
            </React.Fragment>
        );
    }
}

Deposit.propTypes = {
    container_height: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    deposit_url  : PropTypes.string,
    error_message: PropTypes.string,
    is_loading   : PropTypes.bool,
    onMount      : PropTypes.func,
};

export default connect(
    ({ modules }) => ({
        container_height: modules.cashier.container_height,
        deposit_url     : modules.cashier.container_urls.deposit,
        error_message   : modules.cashier.error_message,
        is_loading      : modules.cashier.is_loading,
        onMount         : modules.cashier.onMountDeposit,
    })
)(Deposit);
