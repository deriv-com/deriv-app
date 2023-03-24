import PropTypes from 'prop-types';
import React from 'react';
import { Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';

// Templates are from Binary 1.0, it should be checked if they need change or not and add all of trade types

const TradeCategories = ({ category }) => {
    let TradeTypeTemplate;
    if (category) {
        switch (category) {
            case 'rise_fall':
                TradeTypeTemplate = (
                    <React.Fragment>
                        <Text as='p'>
                            {localize(
                                'If you select "Rise", you win the payout if the exit spot is strictly higher than the entry spot.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'If you select "Fall", you win the payout if the exit spot is strictly lower than the entry spot.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'If you select "Allow equals", you win the payout if exit spot is higher than or equal to entry spot for "Rise". Similarly, you win the payout if exit spot is lower than or equal to entry spot for "Fall".'
                            )}
                        </Text>
                    </React.Fragment>
                );
                break;
            case 'rise_fall_equal':
                TradeTypeTemplate = (
                    <React.Fragment>
                        <Text as='p'>
                            {localize(
                                'If you select "Rise", you win the payout if the exit spot is strictly higher than the entry spot.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'If you select "Fall", you win the payout if the exit spot is strictly lower than the entry spot.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'If you select "Allow equals", you win the payout if exit spot is higher than or equal to entry spot for "Rise". Similarly, you win the payout if exit spot is lower than or equal to entry spot for "Fall".'
                            )}
                        </Text>
                    </React.Fragment>
                );
                break;
            case 'high_low':
                TradeTypeTemplate = (
                    <React.Fragment>
                        <Text as='p'>
                            {localize(
                                'If you select "Higher", you win the payout if the exit spot is strictly higher than the barrier.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'If you select "Lower", you win the payout if the exit spot is strictly lower than the barrier.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize("If the exit spot is equal to the barrier, you don't win the payout.")}
                        </Text>
                    </React.Fragment>
                );
                break;
            case 'end':
                TradeTypeTemplate = (
                    <React.Fragment>
                        <Text as='p'>
                            {localize(
                                'If you select "Ends Between", you win the payout if the exit spot is strictly higher than the Low barrier AND strictly lower than the High barrier.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'If you select "Ends Outside", you win the payout if the exit spot is EITHER strictly higher than the High barrier, OR strictly lower than the Low barrier.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                "If the exit spot is equal to either the Low barrier or the High barrier, you don't win the payout."
                            )}
                        </Text>
                    </React.Fragment>
                );
                break;
            case 'stay':
                TradeTypeTemplate = (
                    <React.Fragment>
                        <Text as='p'>
                            {localize(
                                'If you select "Stays Between", you win the payout if the market stays between (does not touch) either the High barrier or the Low barrier at any time during the contract period'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'If you select "Goes Outside", you win the payout if the market touches either the High barrier or the Low barrier at any time during the contract period.'
                            )}
                        </Text>
                    </React.Fragment>
                );
                break;
            case 'match_diff':
                TradeTypeTemplate = (
                    <React.Fragment>
                        <Text as='p'>
                            {localize(
                                'If you select "Matches", you will win the payout if the last digit of the last tick is the same as your prediction.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'If you select "Differs", you will win the payout if the last digit of the last tick is not the same as your prediction.'
                            )}
                        </Text>
                    </React.Fragment>
                );
                break;
            case 'even_odd':
                TradeTypeTemplate = (
                    <React.Fragment>
                        <Text as='p'>
                            {localize(
                                'If you select "Even", you will win the payout if the last digit of the last tick is an even number (i.e., 2, 4, 6, 8, or 0).'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'If you select "Odd", you will win the payout if the last digit of the last tick is an odd number (i.e., 1, 3, 5, 7, or 9).'
                            )}
                        </Text>
                    </React.Fragment>
                );
                break;
            case 'over_under':
                TradeTypeTemplate = (
                    <React.Fragment>
                        <Text as='p'>
                            {localize(
                                'If you select "Over", you will win the payout if the last digit of the last tick is greater than your prediction.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'If you select "Under", you will win the payout if the last digit of the last tick is less than your prediction.'
                            )}
                        </Text>
                    </React.Fragment>
                );
                break;
            case 'touch':
                TradeTypeTemplate = (
                    <React.Fragment>
                        <Text as='p'>
                            {localize(
                                'If you select "Touch", you win the payout if the market touches the barrier at any time during the contract period.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'If you select "No Touch", you win the payout if the market never touches the barrier at any time during the contract period.'
                            )}
                        </Text>
                    </React.Fragment>
                );
                break;
            case 'asian':
                TradeTypeTemplate = (
                    <React.Fragment>
                        <Text as='p'>
                            {localize(
                                'Asian options settle by comparing the last tick with the average spot over the period.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'If you select "Asian Rise", you will win the payout if the last tick is higher than the average of the ticks.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'If you select "Asian Fall", you will win the payout if the last tick is lower than the average of the ticks.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                "If the last tick is equal to the average of the ticks, you don't win the payout."
                            )}
                        </Text>
                    </React.Fragment>
                );
                break;
            case 'run_high_low':
                TradeTypeTemplate = (
                    <React.Fragment>
                        <Text as='p'>
                            {localize(
                                'If you select "Only Ups", you win the payout if consecutive ticks rise successively after the entry spot. No payout if any tick falls or is equal to any of the previous ticks.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'If you select "Only Downs", you win the payout if consecutive ticks fall successively after the entry spot. No payout if any tick rises or is equal to any of the previous ticks.'
                            )}
                        </Text>
                    </React.Fragment>
                );
                break;
            case 'reset':
                TradeTypeTemplate = (
                    <React.Fragment>
                        <Text as='p'>
                            {localize(
                                'If you select "Reset-Up”, you win the payout if the exit spot is strictly higher than either the entry spot or the spot at reset time.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'If you select "Reset-Down”, you win the payout if the exit spot is strictly lower than either the entry spot or the spot at reset time.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                "If the exit spot is equal to the barrier or the new barrier (if a reset occurs), you don't win the payout."
                            )}
                        </Text>
                    </React.Fragment>
                );
                break;
            case 'callputspread':
                TradeTypeTemplate = (
                    <React.Fragment>
                        <h2>{localize('Spread Up')}</h2>
                        <Text as='p'>
                            {localize(
                                'Win maximum payout if the exit spot is higher than or equal to the upper barrier.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'Win up to maximum payout if exit spot is between lower and upper barrier, in proportion to the difference between exit spot and lower barrier.'
                            )}
                        </Text>
                        <Text as='p'>{localize('No payout if exit spot is below or equal to the lower barrier.')}</Text>
                        <h2>{localize('Spread Down')}</h2>
                        <Text as='p'>
                            {localize(
                                'Win maximum payout if the exit spot is lower than or equal to the lower barrier.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'Win up to maximum payout if exit spot is between lower and upper barrier, in proportion to the difference between upper barrier and exit spot.'
                            )}
                        </Text>
                        <Text as='p'>{localize('No payout if exit spot is above or equal to the upper barrier.')}</Text>
                    </React.Fragment>
                );
                break;
            case 'tick_high_low':
                TradeTypeTemplate = (
                    <React.Fragment>
                        <Text as='p'>
                            {localize(
                                'If you select "High Tick", you win the payout if the selected tick is the highest among the next five ticks.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'If you select "Low Tick", you win the payout if the selected tick is the lowest among the next five ticks.'
                            )}
                        </Text>
                    </React.Fragment>
                );
                break;
            case 'lb_high_low':
                TradeTypeTemplate = (
                    <React.Fragment>
                        <Text as='p'>
                            {localize(
                                'By purchasing the "High-to-Low" contract, you\'ll win the multiplier times the difference between the high and low over the duration of the contract.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'The high is the highest point ever reached by the market during the contract period.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'The low is the lowest point ever reached by the market during the contract period.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'The close is the latest tick at or before the end time. If you selected a specific end time, the end time is the selected time.'
                            )}
                        </Text>
                    </React.Fragment>
                );
                break;
            case 'lb_put':
                TradeTypeTemplate = (
                    <React.Fragment>
                        <Text as='p'>
                            {localize(
                                'By purchasing the "High-to-Close" contract, you\'ll win the multiplier times the difference between the high and close over the duration of the contract.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'The high is the highest point ever reached by the market during the contract period.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'The low is the lowest point ever reached by the market during the contract period.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'The close is the latest tick at or before the end time. If you selected a specific end time, the end time is the selected time.'
                            )}
                        </Text>
                    </React.Fragment>
                );
                break;
            case 'lb_call':
                TradeTypeTemplate = (
                    <React.Fragment>
                        <Text as='p'>
                            {localize(
                                'By purchasing the "Close-to-Low" contract, you\'ll win the multiplier times the difference between the close and low over the duration of the contract.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'The high is the highest point ever reached by the market during the contract period.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'The low is the lowest point ever reached by the market during the contract period.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'The close is the latest tick at or before the end time. If you selected a specific end time, the end time is the selected time.'
                            )}
                        </Text>
                    </React.Fragment>
                );
                break;
            case 'multiplier':
                TradeTypeTemplate = (
                    <React.Fragment>
                        <Text as='p'>
                            {localize(
                                'Predict the market direction and select either “Up” or “Down” to open a position. We will charge a commission when you open a position.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'If you select “Up”, you will earn a profit by closing your position when the market price is higher than the entry spot.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'If you select “Down”, you will earn a profit by closing your position when the market price is lower than the entry spot.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'Your profit is the percentage change in market price times your stake and the multiplier of your choice.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'The Stop-out level on the chart indicates the price at which your potential loss equals your entire stake. When the market price reaches this level, your position will be closed automatically. This ensures that your loss does not exceed the amount you paid to purchase the contract.'
                            )}
                        </Text>
                        <Text as='p'>{localize('These are optional parameters for each position that you open:')}</Text>
                        <ul>
                            <li>
                                {localize(
                                    'If you select “Take profit” and specify an amount that you’d like to earn, your position will be closed automatically when your profit is more than or equals to this amount. Your profit may be more than the amount you entered depending on the market price at closing.'
                                )}
                            </li>
                            <li>
                                {localize(
                                    'If you select “Stop loss” and specify an amount to limit your loss, your position will be closed automatically when your loss is more than or equals to this amount. Your loss may be more than the amount you entered depending on the market price at closing.'
                                )}
                            </li>
                            <li>
                                {localize(
                                    'If you select “Deal cancellation”, you’ll be able to cancel your trade within a chosen time frame should the market move against your favour. We’ll charge a small fee for this, but we’ll return your stake amount without profit or loss. If the stop-out amount is reached before the deal cancellation expires, your position will be cancelled automatically and we’ll return your stake amount without profit or loss. While “Deal cancellation” is active:'
                                )}
                            </li>
                            <ul>
                                <li>
                                    {localize(
                                        '“Stop loss” is deactivated and will only be available when “Deal cancellation” expires.'
                                    )}
                                </li>
                                <li>
                                    {localize(
                                        '“Take profit” cannot be updated. You may update it only when “Deal cancellation” expires.'
                                    )}
                                </li>
                            </ul>
                        </ul>
                        <Text as='p'>
                            {localize(
                                'The entry spot is the market price when your contract is processed by our servers.'
                            )}
                        </Text>
                        <Text as='p'>{localize('The exit spot is the market price when the contract is closed.')}</Text>
                    </React.Fragment>
                );
                break;
            case 'vanilla':
                TradeTypeTemplate = (
                    <React.Fragment>
                        <Text as='p'>
                            {localize(
                                'Predict the market direction and movement size, and select either “Call” or “Put” to open a position.'
                            )}
                        </Text>
                        <Text as='p'>
                            <Localize
                                i18n_default_text='<0>For Call:</0><1/>You will get a payout if the market price is higher than the strike price at the expiry time. Your payout will grow proportionally to the distance between the market and strike prices. You will start making a profit when the payout is higher than your stake. If the market price is equal to or below the strike price at the expiry time, there won’t be a payout.'
                                components={[<strong key={0} />, <br key={1} />]}
                            />
                        </Text>
                        <Text as='p'>
                            <Localize
                                i18n_default_text='<0>For Put:</0><1/>You will get a payout if the market price is lower than the strike price at the expiry time. Your payout will grow proportionally to the distance between the market and strike prices. You will start making a profit when the payout is higher than your stake. If the market price is equal to or above the strike price at the expiry time, there won’t be a payout.'
                                components={[<strong key={0} />, <br key={1} />]}
                            />
                        </Text>
                        <Text as='p'>
                            {localize(
                                'You can determine the expiry of your contract by setting the duration or end time.'
                            )}
                        </Text>
                    </React.Fragment>
                );
                break;
            default:
                TradeTypeTemplate = <Text as='p'>{localize('Description not found.')}</Text>;
                break;
        }
    }
    return <>{TradeTypeTemplate}</>;
};

TradeCategories.propTypes = {
    category: PropTypes.string,
};

export default TradeCategories;
