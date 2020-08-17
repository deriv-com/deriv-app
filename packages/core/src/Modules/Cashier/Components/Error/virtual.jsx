import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button } from '@deriv/components';
import { routes } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

class Virtual extends React.Component {
    onClickSignup = () => {
        this.props.history.push(routes.trade);
        this.props.openRealAccountSignup();
    };

    render = () => {
        return (
            <div className='cashier__wrapper'>
                {this.props.has_real_account && (
                    <div
                        className={classNames(
                            'cashier__account-switch-icon',
                            this.props.is_dark_mode_on
                                ? 'cashier__account-switch-icon--dark'
                                : 'cashier__account-switch-icon--light'
                        )}
                    />
                )}
                <h2 className='cashier__virtual-header'>
                    <Localize i18n_default_text={"You're currently using a demo account"} />
                </h2>
                {this.props.has_real_account ? (
                    <React.Fragment>
                        <p className='cashier__paragraph cashier__text'>
                            <Localize
                                i18n_default_text='You need to switch to a real money account to use this feature.<0/>You can do this by selecting a real account from the <1>Account Switcher.</1>'
                                components={[
                                    <br key={0} />,
                                    <span
                                        key={1}
                                        className='cashier__account-switch-text'
                                        onClick={this.props.toggleAccountsDialog}
                                    />,
                                ]}
                            />
                        </p>
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
    is_dark_mode_on: PropTypes.bool,
    has_real_account: PropTypes.bool,
    openRealAccountSignup: PropTypes.func,
    toggleAccountsDialog: PropTypes.func,
};

export default connect(({ client, ui }) => ({
    is_dark_mode_on: ui.is_dark_mode_on,
    has_real_account: client.has_any_real_account,
    openRealAccountSignup: ui.openRealAccountSignup,
    toggleAccountsDialog: ui.toggleAccountsDialog,
}))(withRouter(Virtual));
