import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Icon, Text } from '@deriv/components';
import { routes } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const Virtual = ({ available_crypto_currencies, has_fiat, history, openRealAccountSignup, toggleAccountsDialog }) => {
    const onClickSignup = () => {
        if(has_fiat && available_crypto_currencies?.length === 0) {
            toggleAccountsDialog();
        } else {
            history.push(routes.trade);
            openRealAccountSignup();
        }
    };

    return (
        <div className='cashier__wrapper'>
            <React.Fragment>
                <div className='cashier-locked'>
                    <Icon icon='IcCashierLocked' className='cashier-locked__icon' />
                    <Text as='h2' weight='bold' align='center' className='cashier-locked__title'>
                        <Localize
                            i18n_default_text='Cashier is locked'
                        />
                    </Text>
                    <Text as='p' size='xs' align='center' className='cashier-locked__desc'>
                        <Localize
                            i18n_default_text='You are using a demo account. Please <0>switch</0> to your real account or <1>create</1> one to access Cashier.'
                            components={[
                                <span
                                    key={0}
                                    className='cashier__account-switch-text'
                                    onClick={toggleAccountsDialog}
                                />,
                                <span
                                    key={1}
                                    className='cashier__account-switch-text'
                                    onClick={onClickSignup}
                                />,
                            ]}
                        />
                    </Text>
                </div>
            </React.Fragment>
        </div>
    );
};

Virtual.propTypes = {
    available_crypto_currencies: PropTypes.array,
    has_fiat: PropTypes.bool,
    history: PropTypes.object,
    openRealAccountSignup: PropTypes.func,
    toggleAccountsDialog: PropTypes.func,
};

export default connect(({ client, ui }) => ({
    available_crypto_currencies: client.available_crypto_currencies,
    has_fiat: client.has_fiat,
    openRealAccountSignup: ui.openRealAccountSignup,
    toggleAccountsDialog: ui.toggleAccountsDialog,
}))(withRouter(Virtual));
