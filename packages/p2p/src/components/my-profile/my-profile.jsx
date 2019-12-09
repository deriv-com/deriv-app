import React        from 'react';
import PropTypes    from 'prop-types';
import { localize } from 'deriv-translations';
import StringUtils from '../../utils/string'
import                   './my-profile.scss';

// TODO: This is just mockup data. it will be removed after Adding BE API.
const user_data = {
    first_name                : 'johny',
    last_name                 : 'bravo',
    security_deposit          : 0,
    buy_trades                : 23,
    sell_trades               : 25,
    past_month_trades         : 42,
    past_month_completion_rate: 99,
    average_release_time      : 5,
    average_release_unit      : 'min',
};

const Cell = (props) => {
    return (
        <div className='my-profile__cell'>
            <div className='my-profile__cell-data'>
                <div className='my-profile__cell-data-main'>
                    {props.value}
                    <sub className="my-profile__cell-data-dimension" >
                        {props.dimension}
                    </sub>
                </div>
                <div className='my-profile__cell-data-sub'>
                    <div className='my-profile__cell-data-sub-upper'>
                        {props.upper_sub_value}
                    </div>
                    <div className='my-profile__cell-data-sub-lower'>
                        {props.lower_sub_value}
                    </div>
                </div>
            </div>
            <div className='my-profile__cell-title'>
                {props.title}
            </div>
        </div>
    );
};

Cell.propTypes = {
    title          : PropTypes.string,
    value          : PropTypes.string,
    dimension      : PropTypes.string,
    upper_sub_value: PropTypes.string,
    lower_sub_value: PropTypes.string,
};

const MyProfile = () => {
    return (
        <div className='my-profile'>
            <div className='my-profile__name'>
                {`${StringUtils.toSentenceCase(user_data.first_name)} ${StringUtils.toSentenceCase(user_data.last_name)}`}
            </div>
            <div className='my-profile__data'>
                <Cell
                    title={localize('Security Deposit')}
                    value={user_data.security_deposit}
                />
                <Cell
                    title={localize('Trades')}
                    value={user_data.buy_trades + user_data.sell_trades}
                    upper_sub_value={localize('{{buy_trades}} buy', { buy_trades: user_data.buy_trades })}
                    lower_sub_value={localize('{{sell_trades}} sell', { sell_trades: user_data.sell_trades })}
                />
                <Cell
                    title={localize('Trades in the last 30 days')}
                    value={user_data.past_month_trades}
                />
                <Cell
                    title={localize('30 day completion rate')}
                    value={`${user_data.past_month_completion_rate}%`}
                />
                <Cell
                    title={localize('Average release time')}
                    value={user_data.average_release_time}
                    dimension={user_data.average_release_unit}
                />
            </div>
        </div>
    );
};

export default MyProfile;
