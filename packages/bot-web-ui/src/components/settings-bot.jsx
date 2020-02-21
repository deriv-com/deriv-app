import React from 'react';
import { localize, Localize } from '@deriv/translations';
import { Checkbox, Media } from '@deriv/components';
import '../assets/sass/settings-bot.scss';

const BotSettings = ({
    setRestartOnBuySellError,
    setRestartOnLastTradeError,
    should_restart_on_buy_sell_error,
    should_restart_on_last_trade_error,
}) => {
    return (
        <Media>
            <Media.Heading>
                <Localize i18n_default_text='Error behaviour' />
            </Media.Heading>
            <Media.Description>
                <div className='bot-settings__restart-options'>
                    <Checkbox
                        id='bot-settings__restart-on-buy-sell-error'
                        defaultChecked={should_restart_on_buy_sell_error || undefined}
                        label={localize('Restart buy/sell on error (disable for better performance)')}
                        onChange={e => setRestartOnBuySellError(e.target.checked)}
                    />
                    <Checkbox
                        id='bot-settings__restart-on-trade-error'
                        defaultChecked={should_restart_on_last_trade_error || undefined}
                        label={localize('Restart last trade on error (bot ignores the unsuccessful trade)')}
                        onChange={e => setRestartOnLastTradeError(e.target.checked)}
                    />
                </div>
            </Media.Description>
        </Media>
    );
};

export default BotSettings;
