import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import routes from 'Constants/routes';
import { connect } from 'Stores/connect';

class Virtual extends React.Component {
    onClickSignup = () => {
        this.props.history.push(routes.trade);
        this.props.openRealAccountSignup();
    };

    render = () => {
        return (
            <div className='cashier__wrapper'>
                <h2 className='cashier-error__header cashier__virtual-header'>
                    <Localize i18n_default_text={"You're currently using a demo account"} />
                </h2>
                {this.props.has_real_account ? (
                    <React.Fragment>
                        <p className='cashier__paragraph cashier__text'>
                            <Localize i18n_default_text='You need to switch to a real money account to use this feature.' />
                            <br />
                            <Localize i18n_default_text='You can do this by selecting a real account from the Account Switcher.' />
                        </p>
                        <div className='cashier__account-switch-icon' />
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <p className='cashier__paragraph cashier__text'>
                            <Localize
                                i18n_default_text={
                                    "You need a real money account to use this feature. It's easy to create a real money account and start trading."
                                }
                            />
                        </p>
                        <Button
                            className='cashier-error__button'
                            has_effect
                            text={localize('Create my real account')}
                            onClick={this.onClickSignup}
                            primary
                            large
                        />
                    </React.Fragment>
                )}
            </div>
        );
    };
}

Virtual.propTypes = {
    has_real_account: PropTypes.bool,
    openRealAccountSignup: PropTypes.func,
};

export default connect(({ client, ui }) => ({
    has_real_account: client.has_any_real_account,
    openRealAccountSignup: ui.openRealAccountSignup,
}))(withRouter(Virtual));
