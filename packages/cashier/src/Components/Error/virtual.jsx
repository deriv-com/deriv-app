import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Text } from '@deriv/components';
import { routes } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const Virtual = ({ has_real_account, history, is_dark_mode_on, openRealAccountSignup, toggleAccountsDialog }) => {
    const onClickSignup = () => {
        history.push(routes.trade);
        openRealAccountSignup();
    };

    return (
        <div className='cashier__wrapper'>
            {has_real_account && (
                <div
                    className={classNames(
                        'cashier__account-switch-icon',
                        is_dark_mode_on ? 'cashier__account-switch-icon--dark' : 'cashier__account-switch-icon--light'
                    )}
                />
            )}
            <h2 className='cashier__virtual-header'>
                <Localize i18n_default_text={"You're currently using a demo account"} />
            </h2>
            {has_real_account ? (
                <React.Fragment>
                    <Text
                        as='p'
                        size='xs'
                        line_height='s'
                        align='center'
                        className='cashier__paragraph cashier__text cashier__text--full-width'
                    >
                        <Localize
                            i18n_default_text='You need to switch to a real money account to use this feature.<0/>You can do this by selecting a real account from the <1>Account Switcher.</1>'
                            components={[
                                <br key={0} />,
                                <span
                                    key={1}
                                    className='cashier__account-switch-text'
                                    onClick={toggleAccountsDialog}
                                />,
                            ]}
                        />
                    </Text>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <Text as='p' size='xs' line_height='s' align='center' className='cashier__paragraph cashier__text'>
                        <Localize
                            i18n_default_text={
                                "You need a real money account to use this feature. It's easy to create a real money account and start trading."
                            }
                        />
                    </Text>
                    <Button
                        className='cashier-error__button'
                        has_effect
                        text={localize('Create my real account')}
                        onClick={onClickSignup}
                        primary
                        large
                    />
                </React.Fragment>
            )}
        </div>
    );
};

Virtual.propTypes = {
    is_dark_mode_on: PropTypes.bool,
    has_real_account: PropTypes.bool,
    history: PropTypes.object,
    openRealAccountSignup: PropTypes.func,
    toggleAccountsDialog: PropTypes.func,
};

export default connect(({ client, ui }) => ({
    is_dark_mode_on: ui.is_dark_mode_on,
    has_real_account: client.has_any_real_account,
    openRealAccountSignup: ui.openRealAccountSignup,
    toggleAccountsDialog: ui.toggleAccountsDialog,
}))(withRouter(Virtual));
