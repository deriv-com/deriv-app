import PropTypes         from 'prop-types';
import React             from 'react';
import { localize }      from '_common/localize';

// Templates are from Binary 1.0, it should be checked if they need change or not and add all of trade types

const TradeCategories = ({ category }) => {
    let TradeTypeTemplate;
    if (category) {
        switch (category) {
            case 'rise_fall':
                TradeTypeTemplate = (
                    <React.Fragment>
                        <p>{ localize('If you select "Rise", you win the payout if the exit spot is strictly higher than the entry spot.') }</p>
                        <p>{ localize('If you select "Fall", you win the payout if the exit spot is strictly lower than the entry spot.') }</p>
                        <p>{ localize('If you select "Allow equals", you win the payout if exit spot is higher than or equal to entry spot for "Rise". Similarly, you win the payout if exit spot is lower than or equal to entry spot for "Fall".') }</p>
                    </React.Fragment>
                );
                break;
            case 'rise_fall_equal':
                TradeTypeTemplate = (
                    <React.Fragment>
                        <p>{ localize('If you select "Rise", you win the payout if the exit spot is strictly higher than the entry spot.') }</p>
                        <p>{ localize('If you select "Fall", you win the payout if the exit spot is strictly lower than the entry spot.') }</p>
                        <p>{ localize('If you select "Allow equals", you win the payout if exit spot is higher than or equal to entry spot for "Rise". Similarly, you win the payout if exit spot is lower than or equal to entry spot for "Fall".') }</p>
                    </React.Fragment>
                );
                break;
            case 'high_low':
                TradeTypeTemplate = (
                    <React.Fragment>
                        <p>{ localize('If you select "Higher", you win the payout if the exit spot is strictly higher than the barrier.') }</p>
                        <p>{ localize('If you select "Lower", you win the payout if the exit spot is strictly lower than the barrier.') }</p>
                        <p>{ localize('If the exit spot is equal to the barrier, you don\'t win the payout.') }</p>
                    </React.Fragment>
                );
                break;
            case 'end':
                TradeTypeTemplate = (
                    <React.Fragment>
                        <p>{ localize('If you select "Ends Between", you win the payout if the exit spot is strictly higher than the Low barrier AND strictly lower than the High barrier.') }</p>
                        <p>{ localize('If you select "Ends Outside", you win the payout if the exit spot is EITHER strictly higher than the High barrier, OR strictly lower than the Low barrier.') }</p>
                        <p>{ localize('If the exit spot is equal to either the Low barrier or the High barrier, you don\'t win the payout.') }</p>
                    </React.Fragment>
                );
                break;
            case 'stay':
                TradeTypeTemplate = (
                    <React.Fragment>
                        <p>{ localize('If you select "Stays Between", you win the payout if the market stays between (does not touch) either the High barrier or the Low barrier at any time during the contract period') }</p>
                        <p>{ localize('If you select "Goes Outside", you win the payout if the market touches either the High barrier or the Low barrier at any time during the contract period.') }</p>
                    </React.Fragment>
                );
                break;
            case 'match_diff':
                TradeTypeTemplate = (
                    <React.Fragment>
                        <p>{ localize('If you select "Matches", you will win the payout if the last digit of the last tick is the same as your prediction.') }</p>
                        <p>{ localize('If you select "Differs", you will win the payout if the last digit of the last tick is not the same as your prediction.') }</p>
                    </React.Fragment>
                );
                break;
            case 'even_odd':
                TradeTypeTemplate = (
                    <React.Fragment>
                        <p>{ localize('If you select "Even", you will win the payout if the last digit of the last tick is an even number (i.e., 2, 4, 6, 8, or 0).') }</p>
                        <p>{ localize('If you select "Odd", you will win the payout if the last digit of the last tick is an odd number (i.e., 1, 3, 5, 7, or 9).') }</p>
                    </React.Fragment>
                );
                break;
            case 'over_under':
                TradeTypeTemplate = (
                    <React.Fragment>
                        <p>{ localize('If you select "Over", you will win the payout if the last digit of the last tick is greater than your prediction.') }</p>
                        <p>{ localize('If you select "Under", you will win the payout if the last digit of the last tick is less than your prediction.') }</p>
                    </React.Fragment>
                );
                break;
            case 'touch':
                TradeTypeTemplate = (
                    <React.Fragment>
                        <p>{ localize('If you select "Touch", you win the payout if the market touches the barrier at any time during the contract period.') }</p>
                        <p>{ localize('If you select "No Touch", you win the payout if the market never touches the barrier at any time during the contract period.') }</p>
                    </React.Fragment>
                );
                break;
            case 'asian':
                TradeTypeTemplate = (
                    <React.Fragment>
                        <p>{ localize('Asian options settle by comparing the last tick with the average spot over the period.') }</p>
                        <p>{ localize('If you select "Asian Rise", you will win the payout if the last tick is higher than the average of the ticks.') }</p>
                        <p>{ localize('If you select "Asian Fall", you will win the payout if the last tick is lower than the average of the ticks.') }</p>
                        <p>{ localize('If the last tick is equal to the average of the ticks, you don\'t win the payout.') }</p>
                    </React.Fragment>
                );
                break;
            default:
                TradeTypeTemplate = (
                    <p>{ localize('Description not found.') }</p>
                );
                break;
        }
    }
    return (
        <div>
            {TradeTypeTemplate}
        </div>
    );
};

TradeCategories.propTypes = {
    category: PropTypes.string,
};

export { TradeCategories };
