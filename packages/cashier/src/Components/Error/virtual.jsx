import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Icon, Text } from '@deriv/components';
import { isMobile, routes } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import 'Sass/virtual.scss';

const Virtual = ({ has_real_account, history, is_dark_mode_on, openRealAccountSignup, toggleAccountsDialog }) => {
    const onClickSignup = () => {
        history.push(routes.trade);
        openRealAccountSignup();
    };

    return (
        <div className='cashier__wrapper'>
            {has_real_account ? (
                <React.Fragment>
                    <div
                        className={classNames(
                            'virtual__account-switch-icon',
                            is_dark_mode_on
                                ? 'virtual__account-switch-icon--dark'
                                : 'virtual__account-switch-icon--light'
                        )}
                    />
                    <Text as='h2' align='center' weight='bold' color='prominent' className='virtual__header'>
                        <Localize i18n_default_text={'You are using a demo account'} />
                    </Text>
                    <Text
                        as='p'
                        size={isMobile() ? 'xxs' : 'xs'}
                        line_height='s'
                        align='center'
                        className='cashier__paragraph cashier__text'
                    >
                        <Localize
                            i18n_default_text='You need to switch to a real money account to use this feature.<0/>You can do this by selecting a real account from the <1>Account Switcher.</1>'
                            components={[
                                <br key={0} />,
                                <span
                                    key={1}
                                    className='virtual__account-switch-text'
                                    onClick={toggleAccountsDialog}
                                />,
                            ]}
                        />
                    </Text>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <div className='cashier-locked'>
                        <Icon icon='IcCashierLocked' className='cashier-locked__icon' />
                        <Text as='h2' weight='bold' align='center' className='cashier-locked__title'>
                            <Localize i18n_default_text='Cashier is locked' />
                        </Text>
                        <Text as='p' size='xs' align='center' className='cashier-locked__desc'>
                            <Localize
                                i18n_default_text='You are using a demo account. Please <0>switch</0> to your real account or <1>create</1> one to access Cashier.'
                                components={[
                                    <span
                                        key={0}
                                        className='virtual__account-switch-text'
                                        onClick={toggleAccountsDialog}
                                    />,
                                    <span key={1} className='virtual__account-switch-text' onClick={onClickSignup} />,
                                ]}
                            />
                        </Text>
                    </div>
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
