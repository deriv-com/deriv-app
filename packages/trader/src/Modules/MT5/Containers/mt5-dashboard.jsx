import { Button } from 'deriv-components';
import React      from 'react';
import Localize   from 'App/Components/Elements/localize.jsx';
import 'Sass/app/modules/mt5-dashboard.scss';

class MT5Dashboard extends React.Component {
    render() {
        const { location } = this.props;

        return (
            <div className='mt5-dashboard'>

                <div className='mt5-dashboard__welcome-message'>
                    <h1 className='mt5-dashboard__welcome-message--heading'>
                        <Localize i18n_default_text='Welcome to Deriv MetaTrader 5 (MT5)' />
                    </h1>
                    <div className='mt5-dashboard__welcome-message--content'>
                        <p className='mt5-dashboard__welcome-message--paragraph'>
                            <Localize i18n_default_text='MetaTrader 5 (MT5) is a popular online trading platform for forex and stock markets. Get prices and currency quotes, perform analysis using charts and technical indicators, and easily view your trading history.' />
                        </p>
                        <Button className='mt5-dashboard__welcome-message--button' type='button'>
                            <p className='mt5-dashboard__welcome-message--paragraph'>
                                <Localize i18n_default_text='Learn more' />
                            </p>
                        </Button>
                    </div>
                </div>

                <div className='mt5-dashboard__accounts-display'>
                    {/* TODO: Add MT5 accounts display component */}
                </div>
            </div>
        );
    }
}

export default MT5Dashboard;
