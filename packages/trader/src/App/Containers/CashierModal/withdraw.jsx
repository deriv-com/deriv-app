import PropTypes   from 'prop-types';
import React       from 'react';
import Localize    from 'App/Components/Elements/localize.jsx';
import Icon        from 'Assets/icon.jsx';
import { connect } from 'Stores/connect';
import Loading     from '../../../templates/_common/components/loading.jsx';

const SendEmail = () => (
    <div>
        <Icon icon='IconAuthenticateWithdrawals' />
        <p>
            <Localize i18n_default_text='To protect your account, we need to authenticate withdrawals.' />
        </p>
    </div>
);

class Withdraw extends React.Component {
    componentDidMount() {
        this.props.onMount();
    }

    render() {
        return (
            <React.Fragment>
                <SendEmail />
                {this.props.is_loading && <Loading />}
                {this.props.withdraw_url &&
                <iframe
                    className='withdraw__content'
                    height={this.props.container_height}
                    src={this.props.withdraw_url}
                    frameBorder='0'
                    scrolling='auto'
                />
                }
                {this.props.error_message && <p>{this.props.error_message}</p>}
                {/* TODO: uncomment this if cross origin issue is fixed */}
                {/* <div */}
                {/*     className='withdraw__content' */}
                {/*     dangerouslySetInnerHTML={{ __html: this.props.withdraw_url }} */}
                {/* /> */}
            </React.Fragment>
        );
    }
}

Withdraw.propTypes = {
    container_height: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    error_message: PropTypes.string,
    is_loading   : PropTypes.bool,
    onMount      : PropTypes.func,
    withdraw_url : PropTypes.string,
};

export default connect(
    ({ modules }) => ({
        container_height: modules.cashier.container_height,
        error_message   : modules.cashier.error_message,
        is_loading      : modules.cashier.is_loading,
        onMount         : modules.cashier.onMountWithdraw,
        withdraw_url    : modules.cashier.container_urls.withdraw,
    })
)(Withdraw);
