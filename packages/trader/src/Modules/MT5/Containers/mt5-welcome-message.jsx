import PropTypes    from 'prop-types';
import React        from 'react';
import { Localize } from '@deriv/translations';

const MT5WelcomeMessage = ({ has_mt5_account }) => {
    return (
        <React.Fragment>
            {!has_mt5_account &&
            <div className='mt5-dashboard__welcome-message'>
                <h1 className='mt5-dashboard__welcome-message--heading'>
                    <Localize i18n_default_text='Welcome to your DMT5 account dashboard and manager' />
                </h1>
                <div className='mt5-dashboard__welcome-message--content'>
                    <p className='mt5-dashboard__welcome-message--paragraph'>
                        <Localize
                            i18n_default_text='MetaTrader 5 (MT5) is a popular online trading platform for forex and stock markets. Get prices and currency quotes, perform analysis using charts and technical indicators, and easily view your trading history.'
                        />
                    </p>
                </div>
            </div>
            }
        </React.Fragment>
    );
};

MT5WelcomeMessage.propTypes = {
    has_mt5_account: PropTypes.bool,
};

export default MT5WelcomeMessage;
