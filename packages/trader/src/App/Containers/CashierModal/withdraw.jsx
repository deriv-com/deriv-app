import PropTypes    from 'prop-types';
import React        from 'react';
import Localize     from 'App/Components/Elements/localize.jsx';
import Button       from 'App/Components/Form/button.jsx';
import { localize } from 'App/i18n';
import Icon         from 'Assets/icon.jsx';
import { connect }  from 'Stores/connect';
import Loading      from '../../../templates/_common/components/loading.jsx';

const SendEmail = ({ sendVerificationEmail, client_email }) => (
    <div className='withdraw__verify-wrapper'>
        <Icon icon='IconAuthenticateWithdrawals' className='withdraw__icon-authenticate' />
        <p>
            <Localize i18n_default_text='To protect your account, we need to authenticate withdrawals.' />
        </p>
        <Button
            className='btn--primary btn--primary--orange withdraw__verify-button'
            classNameSpan='withdraw__verify-button-text'
            has_effect
            text={localize('Get authentication email')}
            onClick={() => { sendVerificationEmail(client_email); }}
        />
    </div>
);

class Withdraw extends React.Component {
    componentDidMount() {
        this.props.onMount();
    }

    render() {
        return (
            <div className='withdraw'>
                <SendEmail
                    sendVerificationEmail={this.props.sendVerificationEmail}
                    client_email={this.props.client_email}
                />
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
            </div>
        );
    }
}

Withdraw.propTypes = {
    client_email    : PropTypes.string,
    container_height: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    error_message        : PropTypes.string,
    is_loading           : PropTypes.bool,
    onMount              : PropTypes.func,
    sendVerificationEmail: PropTypes.func,
    withdraw_url         : PropTypes.string,
};

export default connect(
    ({ client, modules }) => ({
        client_email         : client.email,
        container_height     : modules.cashier.container_height,
        error_message        : modules.cashier.error_message,
        is_loading           : modules.cashier.is_loading,
        onMount              : modules.cashier.onMountWithdraw,
        sendVerificationEmail: modules.cashier.sendVerificationEmail,
        withdraw_url         : modules.cashier.container_urls.withdraw,
    })
)(Withdraw);
