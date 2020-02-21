import PropTypes from 'prop-types';
import React from 'react';
import { Lazy } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from '../stores/connect';

const BotSettingsContainer = props => (
    <Lazy
        {...props}
        ctor={() => import(/* webpackChunkName: "settings-bot", webpackPrefetch: true */ './settings-bot.jsx')}
    />
);

BotSettingsContainer.displayName = 'BotSettingsContainer';

class SettingsExtensions extends React.Component {
    populateSettings = () => {
        const { populateSettingsExtensions } = this.props;

        const menu_items = [
            {
                icon: 'IcBrandDbot',
                label: localize('Bot'),
                value: () => (
                    <BotSettingsContainer
                        setRestartOnBuySellError={this.props.setRestartOnBuySellError}
                        setRestartOnLastTradeError={this.props.setRestartOnLastTradeError}
                        should_restart_on_buy_sell_error={this.props.should_restart_on_buy_sell_error}
                        should_restart_on_last_trade_error={this.props.should_restart_on_last_trade_error}
                    />
                ),
            },
        ];

        populateSettingsExtensions(menu_items);
    };

    componentDidMount() {
        this.populateSettings();
    }

    componentDidUpdate() {
        this.populateSettings();
    }

    componentWillUnmount() {
        this.props.populateSettingsExtensions(null);
    }

    // eslint-disable-next-line class-methods-use-this
    render() {
        return null;
    }
}

SettingsExtensions.propTypes = {
    populateSettingsExtensions: PropTypes.func,
};

export default connect(({ ui, bot_settings }) => ({
    setRestartOnBuySellError: bot_settings.setRestartOnBuySellError,
    setRestartOnLastTradeError: bot_settings.setRestartOnLastTradeError,
    should_restart_on_buy_sell_error: bot_settings.should_restart_on_buy_sell_error,
    should_restart_on_last_trade_error: bot_settings.should_restart_on_last_trade_error,
    populateSettingsExtensions: ui.populateSettingsExtensions,
}))(SettingsExtensions);
